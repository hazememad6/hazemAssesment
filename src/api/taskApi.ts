import { Task } from "src/types/task";

// Generate large dataset for performance testing
const generateLargeTaskDataset = (): Task[] => {
  const tasks: Task[] = [];
  const categories = [
    "Development",
    "Design",
    "Testing",
    "Documentation",
    "Research",
    "Meeting",
    "Planning",
    "Review",
    "Bug Fix",
    "Feature",
    "Optimization",
  ];

  const taskTemplates = [
    { title: "Implement {category} feature", desc: "Complete the {category} implementation with proper testing" },
    { title: "Review {category} code", desc: "Conduct thorough code review for {category} module" },
    { title: "Fix {category} bug", desc: "Resolve critical issue in {category} component" },
    { title: "Optimize {category} performance", desc: "Improve {category} efficiency and speed" },
    { title: "Update {category} documentation", desc: "Refresh and improve {category} docs" },
    { title: "Test {category} functionality", desc: "Comprehensive testing of {category} features" },
    { title: "Refactor {category} module", desc: "Clean up and modernize {category} codebase" },
    { title: "Deploy {category} changes", desc: "Release {category} updates to production" },
  ];

  // Generate 150 tasks for performance testing
  for (let i = 1; i <= 150; i++) {
    const category = categories[i % categories.length];
    const template = taskTemplates[i % taskTemplates.length];
    const isCompleted = Math.random() > 0.7; // 30% completed

    const baseDate = new Date("2024-01-01");
    const createdAt = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000); // Spread over 150 days
    const updatedAt = isCompleted
      ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Updated within a week
      : createdAt;

    tasks.push({
      id: `task_${i.toString().padStart(3, "0")}`,
      title: template.title.replace("{category}", category),
      description: template.desc.replace("{category}", category),
      completed: isCompleted,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }

  return tasks;
};

// In-memory storage with large dataset for performance testing
let TASKS_STORAGE: Task[] = generateLargeTaskDataset();

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(800); // Simulate network delay
    return [...TASKS_STORAGE];
  },

  // Create a new task
  createTask: async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    await delay(500);
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to in-memory storage
    TASKS_STORAGE.push(newTask);
    return newTask;
  },

  // Update an existing task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(400);
    const taskIndex = TASKS_STORAGE.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...TASKS_STORAGE[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    TASKS_STORAGE[taskIndex] = updatedTask;
    return updatedTask;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    const taskIndex = TASKS_STORAGE.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    TASKS_STORAGE.splice(taskIndex, 1);
  },

  // Reset to small dataset (for normal testing)
  resetToSmallDataset: async (): Promise<void> => {
    TASKS_STORAGE = [
      {
        id: "1",
        title: "Complete React Native Assessment",
        description: "Build a secure mobile task manager with authentication",
        completed: false,
        createdAt: "2024-01-15T09:00:00.000Z",
        updatedAt: "2024-01-15T09:00:00.000Z",
      },
      {
        id: "2",
        title: "Implement Dark Mode Toggle",
        description: "Add light/dark theme switching functionality",
        completed: true,
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T11:45:00.000Z",
      },
      {
        id: "3",
        title: "Add Biometric Authentication",
        description: "Integrate fingerprint/face ID login feature",
        completed: false,
        createdAt: "2024-01-15T14:20:00.000Z",
        updatedAt: "2024-01-15T14:20:00.000Z",
      },
    ];
  },

  // Add more test data for stress testing
  generateStressTestData: async (count: number = 500): Promise<void> => {
    TASKS_STORAGE = generateLargeTaskDataset();

    // Add even more for stress testing
    const extraTasks = [];
    for (let i = 151; i <= 150 + count; i++) {
      extraTasks.push({
        id: `stress_${i}`,
        title: `Stress Test Task #${i}`,
        description: `This is a stress test task to evaluate performance with ${count} total items`,
        completed: Math.random() > 0.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    TASKS_STORAGE.push(...extraTasks);
  },
};
