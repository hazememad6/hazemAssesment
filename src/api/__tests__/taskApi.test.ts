import { Task } from "src/types/task";
import { taskApi } from "../taskApi";

describe("taskApi", () => {
  beforeEach(async () => {
    // Reset to small dataset before each test
    await taskApi.resetToSmallDataset();
  });

  describe("getTasks", () => {
    it("should return all tasks", async () => {
      const tasks = await taskApi.getTasks();

      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);

      // Check that each task has required properties
      tasks.forEach((task) => {
        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("title");
        expect(task).toHaveProperty("completed");
        expect(task).toHaveProperty("createdAt");
        expect(task).toHaveProperty("updatedAt");
        expect(typeof task.id).toBe("string");
        expect(typeof task.title).toBe("string");
        expect(typeof task.completed).toBe("boolean");
        expect(typeof task.createdAt).toBe("string");
        expect(typeof task.updatedAt).toBe("string");
      });
    });

    it("should simulate network delay", async () => {
      const startTime = Date.now();
      await taskApi.getTasks();
      const endTime = Date.now();

      // Should take at least 800ms (the delay)
      expect(endTime - startTime).toBeGreaterThanOrEqual(750);
    });
  });

  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      const taskData = {
        title: "New Test Task",
        description: "Test Description",
        completed: false,
      };

      const createdTask = await taskApi.createTask(taskData);

      expect(createdTask).toMatchObject(taskData);
      expect(createdTask.id).toBeDefined();
      expect(typeof createdTask.id).toBe("string");
      expect(createdTask.createdAt).toBeDefined();
      expect(createdTask.updatedAt).toBeDefined();
      expect(new Date(createdTask.createdAt)).toBeInstanceOf(Date);
      expect(new Date(createdTask.updatedAt)).toBeInstanceOf(Date);
    });

    it("should create task without description", async () => {
      const taskData = {
        title: "Task without description",
        completed: true,
      };

      const createdTask = await taskApi.createTask(taskData);

      expect(createdTask.title).toBe(taskData.title);
      expect(createdTask.completed).toBe(taskData.completed);
      expect(createdTask.description).toBeUndefined();
    });

    it("should add task to the task list", async () => {
      const initialTasks = await taskApi.getTasks();
      const initialCount = initialTasks.length;

      const taskData = {
        title: "Added Task",
        description: "Should appear in list",
        completed: false,
      };

      await taskApi.createTask(taskData);

      const updatedTasks = await taskApi.getTasks();
      expect(updatedTasks.length).toBe(initialCount + 1);

      const addedTask = updatedTasks.find((task) => task.title === taskData.title);
      expect(addedTask).toBeDefined();
      expect(addedTask?.description).toBe(taskData.description);
    });

    it("should generate unique IDs", async () => {
      const task1 = await taskApi.createTask({ title: "Task 1", completed: false });
      const task2 = await taskApi.createTask({ title: "Task 2", completed: false });

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe("updateTask", () => {
    let existingTask: Task;

    beforeEach(async () => {
      const tasks = await taskApi.getTasks();
      existingTask = tasks[0];
    });

    it("should update task successfully", async () => {
      const updates = {
        title: "Updated Title",
        completed: true,
      };

      const updatedTask = await taskApi.updateTask(existingTask.id, updates);

      expect(updatedTask.id).toBe(existingTask.id);
      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.completed).toBe(updates.completed);
      expect(updatedTask.description).toBe(existingTask.description);
      expect(updatedTask.createdAt).toBe(existingTask.createdAt);
      expect(updatedTask.updatedAt).not.toBe(existingTask.updatedAt);
    });

    it("should update only provided fields", async () => {
      const updates = { completed: !existingTask.completed };

      const updatedTask = await taskApi.updateTask(existingTask.id, updates);

      expect(updatedTask.completed).toBe(updates.completed);
      expect(updatedTask.title).toBe(existingTask.title);
      expect(updatedTask.description).toBe(existingTask.description);
    });

    it("should throw error for non-existent task", async () => {
      const nonExistentId = "non-existent-id";
      const updates = { title: "Should fail" };

      await expect(taskApi.updateTask(nonExistentId, updates)).rejects.toThrow("Task not found");
    });

    it("should update task in the task list", async () => {
      const updates = { title: "Updated in List" };

      await taskApi.updateTask(existingTask.id, updates);

      const tasks = await taskApi.getTasks();
      const updatedTaskInList = tasks.find((task) => task.id === existingTask.id);

      expect(updatedTaskInList?.title).toBe(updates.title);
    });
  });

  describe("deleteTask", () => {
    let existingTask: Task;

    beforeEach(async () => {
      const tasks = await taskApi.getTasks();
      existingTask = tasks[0];
    });

    it("should delete task successfully", async () => {
      const initialTasks = await taskApi.getTasks();
      const initialCount = initialTasks.length;

      await taskApi.deleteTask(existingTask.id);

      const updatedTasks = await taskApi.getTasks();
      expect(updatedTasks.length).toBe(initialCount - 1);

      const deletedTask = updatedTasks.find((task) => task.id === existingTask.id);
      expect(deletedTask).toBeUndefined();
    });

    it("should throw error for non-existent task", async () => {
      const nonExistentId = "non-existent-id";

      await expect(taskApi.deleteTask(nonExistentId)).rejects.toThrow("Task not found");
    });

    it("should not affect other tasks", async () => {
      const initialTasks = await taskApi.getTasks();
      const otherTasks = initialTasks.filter((task) => task.id !== existingTask.id);

      await taskApi.deleteTask(existingTask.id);

      const updatedTasks = await taskApi.getTasks();

      otherTasks.forEach((otherTask) => {
        const stillExists = updatedTasks.find((task) => task.id === otherTask.id);
        expect(stillExists).toBeDefined();
      });
    });
  });

  describe("resetToSmallDataset", () => {
    it("should reset to default small dataset", async () => {
      // Add some tasks first
      await taskApi.createTask({ title: "Extra Task 1", completed: false });
      await taskApi.createTask({ title: "Extra Task 2", completed: false });

      const tasksBeforeReset = await taskApi.getTasks();
      expect(tasksBeforeReset.length).toBeGreaterThan(3);

      await taskApi.resetToSmallDataset();

      const tasksAfterReset = await taskApi.getTasks();
      expect(tasksAfterReset.length).toBe(3);

      // Check that it contains the expected default tasks
      const taskTitles = tasksAfterReset.map((task) => task.title);
      expect(taskTitles).toContain("Complete React Native Assessment");
      expect(taskTitles).toContain("Implement Dark Mode Toggle");
      expect(taskTitles).toContain("Add Biometric Authentication");
    });
  });

  describe("generateStressTestData", () => {
    it("should generate large dataset for stress testing", async () => {
      await taskApi.generateStressTestData(100);

      const tasks = await taskApi.getTasks();
      expect(tasks.length).toBeGreaterThanOrEqual(100);

      // Verify some tasks have stress test pattern
      const stressTasks = tasks.filter((task) => task.title.includes("Stress Test"));
      expect(stressTasks.length).toBeGreaterThan(0);
    });

    it("should generate default amount when no count provided", async () => {
      await taskApi.generateStressTestData();

      const tasks = await taskApi.getTasks();
      expect(tasks.length).toBeGreaterThanOrEqual(500);
    });
  });

  describe("Network delay simulation", () => {
    it("should simulate appropriate delays for all operations", async () => {
      const operations = [
        () => taskApi.createTask({ title: "Test", completed: false }),
        () => taskApi.updateTask("1", { title: "Updated" }).catch(() => {}), // Might fail, that's ok
        () => taskApi.deleteTask("non-existent").catch(() => {}), // Might fail, that's ok
      ];

      for (const operation of operations) {
        const startTime = Date.now();
        await operation();
        const endTime = Date.now();

        // Should take at least some time (but not too strict since operations might fail)
        expect(endTime - startTime).toBeGreaterThan(100);
      }
    });
  });
});
