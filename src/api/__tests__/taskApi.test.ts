import { taskApi } from "../taskApi";

describe("TaskApi", () => {
  beforeEach(async () => {
    await taskApi.resetToSmallDataset();
  });

  describe("getTasks", () => {
    it("should return all tasks", async () => {
      const tasks = await taskApi.getTasks();
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });

    it("should return tasks with required properties", async () => {
      const tasks = await taskApi.getTasks();
      const task = tasks[0];

      expect(task).toHaveProperty("id");
      expect(task).toHaveProperty("title");
      expect(task).toHaveProperty("description");
      expect(task).toHaveProperty("completed");
      expect(task).toHaveProperty("createdAt");
      expect(task).toHaveProperty("updatedAt");
    });
  });

  describe("createTask", () => {
    it("should create a new task with all required fields", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        completed: false,
      };

      const createdTask = await taskApi.createTask(taskData);

      expect(createdTask.title).toBe(taskData.title);
      expect(createdTask.description).toBe(taskData.description);
      expect(createdTask.completed).toBe(taskData.completed);
      expect(createdTask.id).toBeDefined();
      expect(createdTask.createdAt).toBeDefined();
      expect(createdTask.updatedAt).toBeDefined();
    });

    it("should add task to the storage", async () => {
      const initialTasks = await taskApi.getTasks();
      const initialCount = initialTasks.length;

      await taskApi.createTask({
        title: "New Task",
        description: "New Description",
        completed: false,
      });

      const updatedTasks = await taskApi.getTasks();
      expect(updatedTasks.length).toBe(initialCount + 1);
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const tasks = await taskApi.getTasks();
      const taskToUpdate = tasks[0];

      const updates = {
        title: "Updated Title",
        completed: true,
      };

      const updatedTask = await taskApi.updateTask(taskToUpdate.id, updates);

      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.completed).toBe(updates.completed);
      expect(updatedTask.id).toBe(taskToUpdate.id);
    });

    it("should throw error for non-existent task", async () => {
      await expect(taskApi.updateTask("non-existent-id", { title: "Updated" })).rejects.toThrow("Task not found");
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task", async () => {
      const tasks = await taskApi.getTasks();
      const taskToDelete = tasks[0];
      const initialCount = tasks.length;

      await taskApi.deleteTask(taskToDelete.id);

      const updatedTasks = await taskApi.getTasks();
      expect(updatedTasks.length).toBe(initialCount - 1);
      expect(updatedTasks.find((t) => t.id === taskToDelete.id)).toBeUndefined();
    });

    it("should throw error for non-existent task", async () => {
      await expect(taskApi.deleteTask("non-existent-id")).rejects.toThrow("Task not found");
    });
  });

  describe("dataset management", () => {
    it("should reset to small dataset", async () => {
      await taskApi.resetToSmallDataset();
      const tasks = await taskApi.getTasks();
      expect(tasks.length).toBe(3);
    });

    it("should load large dataset", async () => {
      await taskApi.loadLargeDataset();
      const tasks = await taskApi.getTasks();
      expect(tasks.length).toBeGreaterThan(100);
    });

    it("should generate stress test data", async () => {
      await taskApi.generateStressTestData(100);
      const tasks = await taskApi.getTasks();
      // Large dataset (150) + additional (100) = 250 total
      expect(tasks.length).toBe(250);
    });

    it("should generate default stress test data", async () => {
      await taskApi.generateStressTestData(); // Uses default 500
      const tasks = await taskApi.getTasks();
      // Large dataset (150) + additional (500) = 650 total
      expect(tasks.length).toBe(650);
    });

    it("should provide dataset info", () => {
      const info = taskApi.getDatasetInfo();
      expect(info).toHaveProperty("mode");
      expect(info).toHaveProperty("count");
      expect(typeof info.mode).toBe("string");
      expect(typeof info.count).toBe("number");
    });
  });
});
