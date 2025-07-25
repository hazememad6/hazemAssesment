import { create } from "zustand";
import { persist } from "zustand/middleware";
import { secureStorage } from "../storage";
import { ASYNC_STORAGE_KEYS } from "../storage/storageKeys";
import { STORE_KEYS } from "./storeKeys";

export interface Credentials {
  jwtToken: string;
}

interface AuthState {
  creds: Credentials | null;
  loading: boolean;
  login: (c: Credentials) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      creds: null,
      loading: true,
      login: (c) => set({ creds: c }),
      logout: () => {
        // Clear credentials immediately
        set({ creds: null });

        // Simple cache clearing using constants
        setTimeout(async () => {
          try {
            // Skip cache clearing in test environment
            if (process.env.NODE_ENV === "test") {
              return;
            }

            // Clear React Query cache
            const { queryClient } = await import("../providers/reactQueryProvider");
            queryClient.clear();

            // Clear AsyncStorage React Query cache using constant
            const AsyncStorage = await import("@react-native-async-storage/async-storage");
            await AsyncStorage.default.removeItem(ASYNC_STORAGE_KEYS.REACT_QUERY_OFFLINE_CACHE);

            console.log("✅ Cache cleared on logout");
          } catch (error) {
            console.log("⚠️ Cache clear failed:", error);
          }
        }, 100);
      },
    }),
    {
      name: STORE_KEYS.authStore,
      storage: secureStorage,
      partialize: (s) => ({ creds: s.creds }),
      onRehydrateStorage: () => (_persistedState, error) => {
        if (error) {
          console.error("❌ auth hydration failed", error);
        }
        useAuthStore.setState({ loading: false });
      },
    }
  )
);
