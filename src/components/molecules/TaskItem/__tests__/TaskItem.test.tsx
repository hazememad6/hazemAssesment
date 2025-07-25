import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Task } from "src/types/task";
import { TaskItem } from "../TaskItem";

describe("TaskItem Component", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const defaultProps = {
    task: mockTask,
    onComplete: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Snapshots", () => {
    it("renders incomplete task correctly", () => {
      const tree = render(<TaskItem {...defaultProps} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders completed task correctly", () => {
      const completedTask = { ...mockTask, completed: true };
      const tree = render(<TaskItem {...defaultProps} task={completedTask} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders task without description correctly", () => {
      const taskWithoutDescription = { ...mockTask, description: undefined };
      const tree = render(<TaskItem {...defaultProps} task={taskWithoutDescription} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders task with long title correctly", () => {
      const taskWithLongTitle = {
        ...mockTask,
        title: "This is a very long task title that should wrap properly in the UI",
      };
      const tree = render(<TaskItem {...defaultProps} task={taskWithLongTitle} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("Behavior", () => {
    it("displays task title and description", () => {
      const { getByText } = render(<TaskItem {...defaultProps} />);

      expect(getByText("Test Task")).toBeTruthy();
      expect(getByText("Test Description")).toBeTruthy();
    });

    it("calls onToggleComplete when switch is pressed", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const switchComponent = getByTestId("task-switch-1");

      fireEvent(switchComponent, "valueChange", true);

      expect(defaultProps.onComplete).toHaveBeenCalledWith("1");
    });

    it("calls onDelete when delete button is pressed", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const deleteButton = getByTestId("delete-task-1");

      fireEvent.press(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalledWith("1");
    });

    it("shows correct switch state for incomplete task", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const switchComponent = getByTestId("task-switch-1");

      expect(switchComponent.props.value).toBe(false);
    });

    it("shows correct switch state for completed task", () => {
      const completedTask = { ...mockTask, completed: true };
      const { getByTestId } = render(<TaskItem {...defaultProps} task={completedTask} />);
      const switchComponent = getByTestId("task-switch-1");

      expect(switchComponent.props.value).toBe(true);
    });

    it("does not render description when not provided", () => {
      const taskWithoutDescription = { ...mockTask, description: undefined };
      const { queryByText } = render(<TaskItem {...defaultProps} task={taskWithoutDescription} />);

      expect(queryByText("Test Description")).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("has accessible switch component", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const switchComponent = getByTestId("task-switch-1");

      expect(switchComponent).toBeTruthy();
      expect(switchComponent.props.accessibilityRole).toBe("switch");
    });

    it("has accessible delete button", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const deleteButton = getByTestId("delete-task-1");

      expect(deleteButton).toBeTruthy();
      expect(deleteButton.props.accessible).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles task with empty title", () => {
      const taskWithEmptyTitle = { ...mockTask, title: "" };
      const result = render(<TaskItem {...defaultProps} task={taskWithEmptyTitle} />);

      expect(result).toBeTruthy();
    });

    it("handles task with empty description", () => {
      const taskWithEmptyDescription = { ...mockTask, description: "" };
      const result = render(<TaskItem {...defaultProps} task={taskWithEmptyDescription} />);

      expect(result).toBeTruthy();
    });

    it("handles multiple rapid toggle presses", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const switchComponent = getByTestId("task-switch-1");

      fireEvent(switchComponent, "valueChange", true);
      fireEvent(switchComponent, "valueChange", false);
      fireEvent(switchComponent, "valueChange", true);

      expect(defaultProps.onComplete).toHaveBeenCalledTimes(3);
    });

    it("handles multiple rapid delete presses", () => {
      const { getByTestId } = render(<TaskItem {...defaultProps} />);
      const deleteButton = getByTestId("delete-task-1");

      fireEvent.press(deleteButton);
      fireEvent.press(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalledTimes(2);
    });
  });
});
