import { Button, Input } from "@components/atoms";
import React, { useState } from "react";
import { Text, View } from "react-native";

import { AddTaskFormProps } from "./types";
import { useAddTaskFormStyles } from "./styles";

// form for adding tasks - kinda ugly but works
export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");

  const { containerStyle, titleStyle } = useAddTaskFormStyles();

  // validation is super basic but good enough
  const validateForm = () => {
    if (!title.trim()) {
      setTitleError("Task title is required");
      return false;
    } else if (title.trim().length < 2) {
      setTitleError("Title must be at least 2 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setTitleError("");

    if (!validateForm()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
    };

    onSubmit(taskData);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTitleError("");
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (titleError && text.trim().length > 0) {
      setTitleError("");
    }
  };

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Add New Task</Text>

      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        value={title}
        onChangeText={handleTitleChange}
        error={titleError}
        autoCapitalize="sentences"
        autoFocus={true}
      />

      <Input
        label="Description (Optional)"
        placeholder="Add any additional details..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        autoCapitalize="sentences"
      />

      <Button
        title={loading ? "Adding..." : "Add Task"}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || title.trim().length === 0}
      />
    </View>
  );
};
