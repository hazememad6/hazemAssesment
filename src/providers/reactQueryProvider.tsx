import React, { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ASYNC_STORAGE_KEYS } from "../storage/storageKeys";

const STALE_TIME = 5 * 60 * 1000; // 5 min
const CACHE_TIME = 10 * 60 * 1000; // 10 min
const PERSIST_OFFLINE_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME, // Renamed from cacheTime in v5
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      // Enable offline support
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: 0,
      // Enable offline mutations
      networkMode: "offlineFirst",
    },
  },
});

// Create AsyncStorage persister for offline caching
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: ASYNC_STORAGE_KEYS.REACT_QUERY_OFFLINE_CACHE,
  // Serialize/deserialize for better performance
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: PERSIST_OFFLINE_CACHE_TIME,
        // Only persist successful queries
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.state.status === "success";
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
