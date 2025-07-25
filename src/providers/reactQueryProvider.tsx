import React, { ReactNode } from "react";

import { ASYNC_STORAGE_KEYS } from "../storage/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QUERY_KEYS } from "@query/queryKeys";
import { QueryClient } from "@tanstack/react-query";
import { Task } from "src/types/task";
import Toast from "react-native-toast-message";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { taskApi } from "@api/taskApi";

// cache timing constants - probably could tweak these
const CACHE_TIME = 10 * 60 * 1000; // 10 min
const PERSIST_OFFLINE_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // never stale from cache
      gcTime: CACHE_TIME,
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: false, // no auto refresh
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst", // cache first
    },
    mutations: {
      retry: 0,
      networkMode: "offlineFirst", // works offline
    },
  },
});

// async storage persister for offline caching
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: ASYNC_STORAGE_KEYS.REACT_QUERY_OFFLINE_CACHE,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// validate cache against current taskapi state - prevents orphaned tasks
export const validateCacheWithServer = async () => {
  try {
    const serverTasks = await taskApi.getTasks();
    const serverTaskIds = new Set(serverTasks.map((task) => task.id));

    const cachedTasks = (queryClient.getQueryData(QUERY_KEYS.tasks.all) as Task[]) || [];

    // filter out tasks that don't exist on server
    const validTasks = cachedTasks.filter((task) => serverTaskIds.has(task.id));
    const removedCount = cachedTasks.length - validTasks.length;

    if (removedCount > 0) {
      console.log(`🧹 removed ${removedCount} orphaned tasks from cache`);
      queryClient.setQueryData(QUERY_KEYS.tasks.all, validTasks);

      // let user know what happened
      Toast.show({
        type: "info",
        text1: "Cache cleaned",
        text2: `Removed ${removedCount} unsaved task${removedCount > 1 ? "s" : ""}`,
        visibilityTime: 3000,
      });
    }

    console.log(`✅ cache validated: ${validTasks.length} valid tasks`);
  } catch (error) {
    console.error("❌ cache validation failed:", error);
  }
};

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // No automatic cache validation on startup - only when user refreshes
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: PERSIST_OFFLINE_CACHE_TIME,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

// cache utilities - keep it simple
export const clearCache = async () => {
  try {
    await queryClient.clear();
    await asyncStoragePersister.removeClient();
    console.log("cache cleared");
  } catch (error) {
    console.error("failed to clear cache:", error);
  }
};
