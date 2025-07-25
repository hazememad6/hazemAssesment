import React from "react";
import { Switch, Text, View } from "react-native";
import { Button } from "@components/atoms";
import { useThemeStore } from "@store/themeStore";
import { useTaskItemStyles } from "./styles";
import { TaskItemProps } from "./types";

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  const { theme } = useThemeStore();
  const { containerStyle, rowStyle, contentStyle, titleStyle, descriptionStyle, actionsStyle } =
    useTaskItemStyles(task);

  return (
    <View style={containerStyle}>
      <View style={rowStyle}>
        <View style={contentStyle}>
          <Text style={titleStyle}>{task.title}</Text>
          {task.description && <Text style={descriptionStyle}>{task.description}</Text>}
        </View>

        <View style={actionsStyle}>
          <Switch
            value={task.completed}
            onValueChange={() => onComplete(task.id)}
            trackColor={{ false: theme.colors.border, true: theme.colors.success }}
            thumbColor={task.completed ? "#ffffff" : "#f4f3f4"}
            testID={`task-switch-${task.id}`}
          />

          <Button
            title="Delete"
            onPress={() => onDelete(task.id)}
            variant="outline"
            size="small"
            testID={`delete-task-${task.id}`}
          />
        </View>
      </View>
    </View>
  );
};

// Memoize to prevent unnecessary re-renders
export const MemoizedTaskItem = React.memo(TaskItem, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.updatedAt === nextProps.task.updatedAt
  );
});

// Keep the original export for backward compatibility
export { MemoizedTaskItem as TaskItem };
