// Centralized query keys for better organization and type safety

export const QUERY_KEYS = {
  // Auth related queries
  auth: {
    user: ["auth", "user"] as const,
    profile: ["auth", "profile"] as const,
    permissions: ["auth", "permissions"] as const,
  },

  // Task related queries
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: TaskFilters) => ["tasks", "list", filters] as const,
    detail: (id: string) => ["tasks", "detail", id] as const,
    stats: ["tasks", "stats"] as const,
  },

  // Settings/Config queries
  settings: {
    all: ["settings"] as const,
    theme: ["settings", "theme"] as const,
    notifications: ["settings", "notifications"] as const,
  },
} as const;

// Centralized mutation keys for better organization
export const MUTATION_KEYS = {
  // Auth mutations
  auth: {
    login: ["auth", "login"] as const,
    logout: ["auth", "logout"] as const,
    register: ["auth", "register"] as const,
  },

  // Task mutations
  tasks: {
    add: ["tasks", "add"] as const,
    update: ["tasks", "update"] as const,
    delete: ["tasks", "delete"] as const,
    toggle: ["tasks", "toggle"] as const,
  },

  // Settings mutations
  settings: {
    updateTheme: ["settings", "updateTheme"] as const,
    updateNotifications: ["settings", "updateNotifications"] as const,
  },
} as const;

// Types for query keys
export type QueryKeys = typeof QUERY_KEYS;
export type MutationKeys = typeof MUTATION_KEYS;

// Task related types
export interface TaskFilters {
  completed?: boolean;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// Error response type
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, any>;
}

// Query configuration types
export interface QueryConfig {
  staleTime?: number;
  gcTime?: number;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  refetchOnWindowFocus?: boolean;
  networkMode?: "online" | "always" | "offlineFirst";
}

// Mutation configuration types
export interface MutationConfig {
  onMutate?: (variables: any) => Promise<any> | any;
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
  invalidate?: string[][];
}
