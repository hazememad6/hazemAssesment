import { ASYNC_STORAGE_KEYS } from "../storage/storageKeys";
import { STORE_KEYS } from "./storeKeys";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { secureStorage } from "../storage";

export interface Credentials {
  jwtToken: string;
}

interface AuthState {
  creds: Credentials | null;
  loading: boolean;
  login: (c: Credentials) => void;
  logout: () => void;
}

// timeout ref for logout cleanup - kinda hacky but works
let logoutTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      creds: null,
      loading: true,
      login: (c) => set({ creds: c }),
      logout: () => {
        set({ creds: null });

        // clear any existing timeout
        cleanupAuthStore();

        // clear cache after logout - prevents data leaks
        logoutTimeoutId = setTimeout(async () => {
          try {
            if (process.env.NODE_ENV === "test") return; // skip in tests

            const { queryClient } = await import("../providers/reactQueryProvider");
            queryClient.clear();

            const AsyncStorage = await import("@react-native-async-storage/async-storage");
            await AsyncStorage.default.removeItem(ASYNC_STORAGE_KEYS.REACT_QUERY_OFFLINE_CACHE);

            console.log("✅ cache cleared on logout");
          } catch (error) {
            console.log("⚠️ cache clear failed:", error);
          } finally {
            logoutTimeoutId = null;
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

// cleanup helper - called from logout
export const cleanupAuthStore = () => {
  if (logoutTimeoutId) {
    clearTimeout(logoutTimeoutId);
    logoutTimeoutId = null;
  }
};
