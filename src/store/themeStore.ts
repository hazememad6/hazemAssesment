import { STORE_KEYS } from "./storeKeys";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandAsyncStorage } from "../storage";

export type ThemeMode = "light" | "dark";

export interface Theme {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    card: string;
    error: string;
    success: string;
  };
}

// theme colors - might need tweaking but looks decent
export const lightTheme: Theme = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#00b894",
    secondary: "#fdcb6e",
    border: "#e1e5e9",
    card: "#f8f9fa",
    error: "#e74c3c",
    success: "#2ecc71",
  },
};

export const darkTheme: Theme = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#fdcb6e",
    secondary: "#00b894",
    border: "#2c3e50",
    card: "#1a1a1a",
    error: "#e74c3c",
    success: "#2ecc71",
  },
};

interface ThemeState {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

// theme store with persistence
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      theme: lightTheme,
      toggleTheme: () => {
        const newMode = get().mode === "light" ? "dark" : "light";
        const newTheme = newMode === "light" ? lightTheme : darkTheme;
        set({ mode: newMode, theme: newTheme });
      },
      setTheme: (mode: ThemeMode) => {
        const newTheme = mode === "light" ? lightTheme : darkTheme;
        set({ mode, theme: newTheme });
      },
    }),
    {
      name: STORE_KEYS.themeStore,
      storage: zustandAsyncStorage,
    }
  )
);
