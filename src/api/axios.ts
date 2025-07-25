import axios, { AxiosError, AxiosResponse } from "axios";

import { ApiError } from "@query/queryKeys";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

// api config from expo config
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || "https://jsonplaceholder.typicode.com";
const API_TIMEOUT = Constants.expoConfig?.extra?.apiTimeout || 10000;

// custom error class - probably overkill but looks professional
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

// request interceptor - would add auth token here
apiClient.interceptors.request.use(
  (config) => {
    // TODO: add auth token
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
    console.error("request error:", error);
    return Promise.reject(error);
  }
);

// response interceptor with global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    console.error("api error:", error);

    const skipGlobalError = (error.config as any)?.skipGlobalError;

    let errorMessage = "an error occurred";
    let statusCode = 0;
    let errorDetails: Record<string, any> | undefined;

    if (error.response) {
      // server error
      const { status, data } = error.response;
      statusCode = status;
      errorMessage = data?.message || `server error (${status})`;
      errorDetails = data?.details;
    } else if (error.request) {
      // network error
      errorMessage = "network error. please check your connection.";
      statusCode = 0;
    } else {
      // request setup error
      errorMessage = error.message || "request failed";
      statusCode = 0;
    }

    // show global toast unless skipped
    if (!skipGlobalError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        visibilityTime: 4000,
      });
    }

    throw new ApiErrorClass(errorMessage, statusCode, error.response?.data?.error, errorDetails);
  }
);

export default apiClient;
