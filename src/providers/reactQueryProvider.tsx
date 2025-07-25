import React, { ReactNode, useEffect } from "react";

import { ASYNC_STORAGE_KEYS } from "../storage/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const STALE_TIME = 5 * 60 * 1000; // 5 min
const CACHE_TIME = 10 * 60 * 1000; // 10 min
const PERSIST_OFFLINE_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: false, // Don't auto-refetch on reconnect
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst", // Cache-first approach
    },
    mutations: {
      retry: 0,
      networkMode: "offlineFirst", // Mutations work offline
    },
  },
});

// Create AsyncStorage persister for offline caching
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: ASYNC_STORAGE_KEYS.REACT_QUERY_OFFLINE_CACHE,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// Validate cache against current TaskApi state
export const validateCacheWithServer = async () => {
  try {
    // Import taskApi dynamically to avoid circular dependency
    const { taskApi } = await import("../api/taskApi");

    // Get current server state
    const serverTasks = await taskApi.getTasks();
    const serverTaskIds = new Set(serverTasks.map((task) => task.id));

    // Get cached tasks
    const cachedTasks = (queryClient.getQueryData(["tasks"]) as any[]) || [];

    // Filter out tasks that don't exist on server
    const validTasks = cachedTasks.filter((task) => serverTaskIds.has(task.id));
    const removedCount = cachedTasks.length - validTasks.length;

    if (removedCount > 0) {
      console.log(`🧹 Removed ${removedCount} orphaned tasks from cache`);
      queryClient.setQueryData(["tasks"], validTasks);
    }

    console.log(`✅ Cache validated: ${validTasks.length} valid tasks`);
  } catch (error) {
    console.error("❌ Cache validation failed:", error);
  }
};

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Validate cache after hydration with a delay to ensure taskApi is ready
    const timer = setTimeout(validateCacheWithServer, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: PERSIST_OFFLINE_CACHE_TIME,
        // Persist all successful queries
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

// Simple cache utilities
export const clearCache = async () => {
  try {
    await queryClient.clear();
    await asyncStoragePersister.removeClient();
    console.log("Cache cleared");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
};
