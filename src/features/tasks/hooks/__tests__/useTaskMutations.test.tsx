import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { taskApi } from "src/api/taskApi";
import { useAddTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from "../useTaskMutations";

// Mock the taskApi
jest.mock("src/api/taskApi", () => ({
  taskApi: {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

// Mock Toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("Task Mutations", () => {
  let queryClient: QueryClient;

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  describe("useAddTaskMutation", () => {
    it("should create a new task successfully", async () => {
      const mockTask = {
        id: "1",
        title: "New Task",
        description: "Task description",
        completed: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      (taskApi.createTask as jest.Mock).mockResolvedValue(mockTask);

      const { result } = renderHook(() => useAddTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate({
          title: "New Task",
          description: "Task description",
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(taskApi.createTask).toHaveBeenCalledWith({
        title: "New Task",
        description: "Task description",
        completed: false,
      });
    });

    it("should handle add task error", async () => {
      const error = new Error("Failed to create task");
      (taskApi.createTask as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAddTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate({
          title: "New Task",
          description: "Task description",
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it("should track loading state", async () => {
      let resolvePromise: any;
      (taskApi.createTask as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useAddTaskMutation(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isPending).toBe(false);

      act(() => {
        result.current.mutate({
          title: "New Task",
          description: "Task description",
        });
      });

      // Wait for the mutation to start
      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      // Resolve the promise to complete the mutation
      act(() => {
        resolvePromise();
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });
  });

  describe("useUpdateTaskMutation", () => {
    it("should update a task successfully", async () => {
      const mockTask = {
        id: "1",
        title: "Updated Task",
        description: "Updated description",
        completed: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      (taskApi.updateTask as jest.Mock).mockResolvedValue(mockTask);

      const { result } = renderHook(() => useUpdateTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate({
          id: "1",
          updates: { completed: true },
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(taskApi.updateTask).toHaveBeenCalledWith("1", { completed: true });
    });

    it("should handle update task error", async () => {
      const error = new Error("Failed to update task");
      (taskApi.updateTask as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate({
          id: "1",
          updates: { completed: true },
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it("should not update task with temp_ id", async () => {
      const { result } = renderHook(() => useUpdateTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate({
          id: "temp_123",
          updates: { completed: true },
        });
      });

      // Should not call the API for temp tasks
      expect(taskApi.updateTask).not.toHaveBeenCalled();
    });
  });

  describe("useDeleteTaskMutation", () => {
    it("should delete a task successfully", async () => {
      (taskApi.deleteTask as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate("1");
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(taskApi.deleteTask).toHaveBeenCalledWith("1");
    });

    it("should handle delete task error", async () => {
      const error = new Error("Failed to delete task");
      (taskApi.deleteTask as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate("1");
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it("should not delete task with temp_ id", async () => {
      const { result } = renderHook(() => useDeleteTaskMutation(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.mutate("temp_123");
      });

      // Should not call the API for temp tasks
      expect(taskApi.deleteTask).not.toHaveBeenCalled();
    });
  });
});
