// Jest matchers are now built into @testing-library/react-native v12.4+

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock SecureStore
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock Expo Router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
}));

// Mock Toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock FlashList
jest.mock("@shopify/flash-list", () => ({
  FlashList: "FlatList",
}));

// Mock Expo Vector Icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, testID, ...props }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(
      Text,
      {
        ...props,
        testID: testID || `icon-${name}`,
      },
      `Icon-${name}`
    );
  },
}));

// Mock useMetrics hook
jest.mock("src/hooks/useMetrics", () => ({
  useMetrics: () => ({
    wp: (val: number) => val,
    hp: (val: number) => val,
    scale: (val: number) => val,
    moderateScale: (val: number) => val,
    verticalScale: (val: number) => val,
    horizontalScale: (val: number) => val,
  }),
}));

// Mock useThemeStore hook
jest.mock("src/store/themeStore", () => ({
  useThemeStore: () => ({
    theme: {
      colors: {
        primary: "#007AFF",
        secondary: "#5856D6",
        success: "#34C759",
        warning: "#FF9500",
        danger: "#FF3B30",
        text: "#000000",
        background: "#FFFFFF",
        card: "#F2F2F7",
        border: "#C6C6C8",
      },
    },
  }),
}));

// Mock Dimensions utility
jest.mock("src/utils/dimensions", () => ({
  Dimensions: {
    primarySpace: 16,
    secondarySpace: 8,
    sectionSpace: 24,
    tinySpace: 2,
    regularIcon: 24,
    smallIcon: 16,
    largeIcon: 32,
  },
}));

// Simple React Native mocks to avoid native module issues
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  // Mock only the components that might cause issues
  RN.Alert = {
    alert: jest.fn(),
  };

  // Create a proper TouchableOpacity mock before using it in Switch
  const MockTouchableOpacity = jest
    .fn()
    .mockImplementation(({ onPress, children, testID, accessibilityRole, accessible = true, ...props }) => {
      const React = require("react");
      return React.createElement(
        RN.View,
        {
          ...props,
          testID: testID,
          accessibilityRole: accessibilityRole,
          accessible: accessible,
          onPress: onPress,
        },
        children
      );
    });

  // Mock Switch to render ON/OFF text and handle testID
  RN.Switch = jest.fn().mockImplementation(({ value, onValueChange, testID, accessible = true, ...props }) => {
    const React = require("react");
    return React.createElement(
      MockTouchableOpacity,
      {
        ...props,
        onPress: () => onValueChange && onValueChange(!value),
        testID: testID,
        accessibilityRole: "switch",
        accessible: accessible,
      },
      React.createElement(RN.Text, {}, value ? "ON" : "OFF")
    );
  });

  RN.TouchableOpacity = MockTouchableOpacity;

  return RN;
});

// Mock React Query Provider for dynamic imports
jest.mock("src/providers/reactQueryProvider", () => ({
  queryClient: {
    clear: jest.fn(),
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  },
}));

// Mock AsyncStorage for dynamic imports
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

// Global test utilities - suppress console noise during tests
global.console = {
  ...console,
  // Suppress all console output during tests for cleaner output
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};
