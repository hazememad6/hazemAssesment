import { AddTaskFormData, AddTaskModalProps } from "./types";
import { Alert, Modal, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

import { Button } from "@components/atoms";
import { useAddTaskModalStyles } from "./styles";

// modal for adding tasks - probably overkill but looks nice
export const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose, onAddTask, loading = false }) => {
  const [formData, setFormData] = useState<AddTaskFormData>({
    title: "",
    description: "",
  });

  const styles = useAddTaskModalStyles();

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    onAddTask({
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      completed: false,
    });

    // clean up and close
    setFormData({ title: "", description: "" });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="Cancel" onPress={onClose} variant="outline" size="small" />
          <Text style={styles.headerTitle}>Add New Task</Text>
          <Button
            title={loading ? "Adding..." : "Add"}
            onPress={handleSubmit}
            variant="primary"
            size="small"
            disabled={loading}
            loading={loading}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(title) => setFormData((prev) => ({ ...prev, title }))}
              placeholder="Enter task title"
              multiline={false}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(description) => setFormData((prev) => ({ ...prev, description }))}
              placeholder="Enter task description (optional)"
              multiline={true}
              numberOfLines={4}
              maxLength={500}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
