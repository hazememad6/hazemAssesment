import { Task } from "src/types/task";

// Small default dataset for normal usage
const generateSmallTaskDataset = (): Task[] => {
  return [
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
};

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

// Simple in-memory storage for this session only
let TASKS_STORAGE: Task[] = generateSmallTaskDataset();
let CURRENT_DATASET_MODE: "small" | "large" | "stress" = "small";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const taskApi = {
  // Get all tasks - simple memory read
  getTasks: async (): Promise<Task[]> => {
    await delay(500);
    return [...TASKS_STORAGE];
  },

  // Create a new task - simple memory write
  createTask: async (taskData: { title: string; description: string; completed: boolean }): Promise<Task> => {
    await delay(800);

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    TASKS_STORAGE.push(newTask);
    return newTask;
  },

  // Update an existing task - simple memory update
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(300);

    const taskIndex = TASKS_STORAGE.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const updatedTask: Task = {
      ...TASKS_STORAGE[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    TASKS_STORAGE[taskIndex] = updatedTask;
    return updatedTask;
  },

  // Delete a task - simple memory delete
  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    const initialLength = TASKS_STORAGE.length;
    TASKS_STORAGE = TASKS_STORAGE.filter((t) => t.id !== id);
    if (TASKS_STORAGE.length >= initialLength) {
      throw new Error("Task not found");
    }
  },

  // Reset to small dataset (for normal testing)
  resetToSmallDataset: async (): Promise<void> => {
    TASKS_STORAGE = generateSmallTaskDataset();
    CURRENT_DATASET_MODE = "small";
    console.log("📊 Dataset reset to SMALL (3 tasks)");
  },

  // Load large dataset for performance testing
  loadLargeDataset: async (): Promise<void> => {
    TASKS_STORAGE = generateLargeTaskDataset();
    CURRENT_DATASET_MODE = "large";
    console.log("📊 Dataset loaded: LARGE (150 tasks)");
  },

  // Add more test data for stress testing
  generateStressTestData: async (count: number = 500): Promise<void> => {
    TASKS_STORAGE = generateLargeTaskDataset();
    CURRENT_DATASET_MODE = "stress";

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
    console.log(`📊 Dataset loaded: STRESS (${TASKS_STORAGE.length} tasks)`);
  },

  // Debug method to get current dataset info
  getDatasetInfo: (): { mode: typeof CURRENT_DATASET_MODE; count: number } => {
    return {
      mode: CURRENT_DATASET_MODE,
      count: TASKS_STORAGE.length,
    };
  },
};
