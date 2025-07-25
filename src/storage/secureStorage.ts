import * as SecureStore from "expo-secure-store";

import { StateStorage, createJSONStorage } from "zustand/middleware";

// secure storage adapter for zustand - keeps auth tokens safe
const secureStoreAdapter: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const secureStorage = createJSONStorage(() => secureStoreAdapter);
