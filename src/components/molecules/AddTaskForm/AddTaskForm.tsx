import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Input } from "@components/atoms";
import { useAddTaskFormStyles } from "./styles";
import { AddTaskFormProps } from "./types";

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const { containerStyle, titleStyle } = useAddTaskFormStyles();

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError("Task title is required");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTitleError("");
  };

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Add New Task</Text>

      <Input
        label="Task Title"
        placeholder="Enter task title..."
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (titleError) setTitleError("");
        }}
        error={titleError}
        autoCapitalize="sentences"
      />

      <Input
        label="Description (Optional)"
        placeholder="Enter task description..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        autoCapitalize="sentences"
      />

      <Button title="Add Task" onPress={handleSubmit} loading={loading} disabled={loading} />
    </View>
  );
};
