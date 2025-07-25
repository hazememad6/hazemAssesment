import * as SecureStore from "expo-secure-store";
import { StateStorage, createJSONStorage } from "zustand/middleware";

const secureStoreAdapter: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),

  setItem: (name, value) => SecureStore.setItemAsync(name, value),

  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const secureStorage = createJSONStorage(() => secureStoreAdapter);
