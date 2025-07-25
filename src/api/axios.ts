import axios, { AxiosError, AxiosResponse } from "axios";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { ApiError } from "@query/queryKeys";

// Get API configuration from environment variables
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || "https://jsonplaceholder.typicode.com";
const API_TIMEOUT = Constants.expoConfig?.extra?.apiTimeout || 10000;

// Custom error class for better error handling
export class ApiErrorClass extends Error {
  public statusCode: number;
  public error?: string;
  public details?: Record<string, any>;

  constructor(message: string, statusCode: number, error?: string, details?: Record<string, any>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, you'd get the token from secure storage
    // const token = await SecureStore.getItemAsync('authToken');
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with global toast messages
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    console.error("API Error:", error);

    // Check if global error handling should be skipped
    const skipGlobalError = error.config?.skipGlobalError;

    let errorMessage = "An error occurred";
    let statusCode = 0;
    let errorDetails: Record<string, any> | undefined;

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      statusCode = status;
      errorMessage = data?.message || `Server error (${status})`;
      errorDetails = data?.details;
    } else if (error.request) {
      // Network error
      errorMessage = "Network error. Please check your connection.";
      statusCode = 0;
    } else {
      // Request setup error
      errorMessage = error.message || "Request failed";
      statusCode = 0;
    }

    // Show global toast error unless skipped
    if (!skipGlobalError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        visibilityTime: 4000,
      });
    }

    // Always throw the error for component-level handling if needed
    throw new ApiErrorClass(errorMessage, statusCode, error.response?.data?.error, errorDetails);
  }
);

export default apiClient;
