import { StateStorage, createJSONStorage } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";

// async storage wrapper for zustand - adds error handling
export const asyncStorage: StateStorage = {
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error("asyncstorage getitem error:", error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("asyncstorage setitem error:", error);
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("asyncstorage removeitem error:", error);
    }
  },
};

export const zustandAsyncStorage = createJSONStorage(() => asyncStorage);
