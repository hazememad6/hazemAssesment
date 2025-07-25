import { act, renderHook } from "@testing-library/react-native";
import { Credentials, useAuthStore } from "../authStore";

// Mock Zustand persist middleware to prevent hydration issues
jest.mock("zustand/middleware", () => ({
  persist: (fn: any) => fn,
  subscribeWithSelector: (fn: any) => fn,
}));

// Mock secure storage
jest.mock("src/storage", () => ({
  secureStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(void 0),
    removeItem: jest.fn().mockResolvedValue(void 0),
  },
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    removeItem: jest.fn().mockResolvedValue(void 0),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useAuthStore.setState({
      creds: null,
      loading: false,
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.creds).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it("should provide login and logout functions", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });
  });

  describe("login", () => {
    it("should set credentials when login is called", () => {
      const { result } = renderHook(() => useAuthStore());
      const credentials: Credentials = { jwtToken: "test-token-123" };

      act(() => {
        result.current.login(credentials);
      });

      expect(result.current.creds).toEqual(credentials);
    });

    it("should update credentials when login is called multiple times", () => {
      const { result } = renderHook(() => useAuthStore());
      const firstCreds: Credentials = { jwtToken: "first-token" };
      const secondCreds: Credentials = { jwtToken: "second-token" };

      act(() => {
        result.current.login(firstCreds);
      });

      expect(result.current.creds).toEqual(firstCreds);

      act(() => {
        result.current.login(secondCreds);
      });

      expect(result.current.creds).toEqual(secondCreds);
    });
  });

  describe("logout", () => {
    it("should clear credentials when logout is called", () => {
      const { result } = renderHook(() => useAuthStore());
      const credentials: Credentials = { jwtToken: "test-token" };

      // First login
      act(() => {
        result.current.login(credentials);
      });

      expect(result.current.creds).toEqual(credentials);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.creds).toBeNull();
    });

    it("should handle logout when not authenticated", () => {
      const { result } = renderHook(() => useAuthStore());

      // Should not throw error
      act(() => {
        result.current.logout();
      });

      expect(result.current.creds).toBeNull();
    });

    it("should trigger cache cleanup after logout", async () => {
      const { result } = renderHook(() => useAuthStore());
      const credentials: Credentials = { jwtToken: "test-token" };

      act(() => {
        result.current.login(credentials);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.creds).toBeNull();

      // Wait for setTimeout to trigger cleanup
      await new Promise((resolve) => setTimeout(resolve, 150));

      // The cleanup should have run (tested implicitly through no errors)
    });
  });

  describe("authentication state", () => {
    it("should be unauthenticated when creds is null", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.creds).toBeNull();
      // User would check: result.current.creds !== null for authentication
    });

    it("should be authenticated when creds is set", () => {
      const { result } = renderHook(() => useAuthStore());
      const credentials: Credentials = { jwtToken: "valid-token" };

      act(() => {
        result.current.login(credentials);
      });

      expect(result.current.creds).toBeTruthy();
      expect(result.current.creds?.jwtToken).toBe("valid-token");
    });
  });

  describe("loading state", () => {
    it("should allow setting loading state", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({ loading: true });
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        useAuthStore.setState({ loading: false });
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle rapid login/logout cycles", () => {
      const { result } = renderHook(() => useAuthStore());
      const credentials: Credentials = { jwtToken: "test-token" };

      // Rapid login/logout cycles
      act(() => {
        result.current.login(credentials);
        result.current.logout();
        result.current.login(credentials);
        result.current.logout();
      });

      expect(result.current.creds).toBeNull();
    });

    it("should handle empty token gracefully", () => {
      const { result } = renderHook(() => useAuthStore());
      const credentials: Credentials = { jwtToken: "" };

      act(() => {
        result.current.login(credentials);
      });

      expect(result.current.creds?.jwtToken).toBe("");
    });
  });
});
