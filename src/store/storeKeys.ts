import { SECURE_STORAGE_KEYS } from "../storage/storageKeys";

export const STORE_KEYS = {
  authStore: SECURE_STORAGE_KEYS.AUTH_STORE,
  themeStore: SECURE_STORAGE_KEYS.THEME_STORE,
} as const;
