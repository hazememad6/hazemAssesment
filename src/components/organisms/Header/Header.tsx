import { Text, View } from "react-native";

import { Button } from "@components/atoms";
import { HeaderProps } from "./types";
import React from "react";
import { useHeaderFeature } from "./hooks/useHeaderFeature";
import { useHeaderStyles } from "./styles";

// header component - title, stats, and action buttons
export const Header: React.FC<HeaderProps> = ({ taskStats, onAddTask, onRefresh }) => {
  const styles = useHeaderStyles();
  const { showDebugOptions, mode, toggleTheme, handleToggleDebugOptions, handleDatasetTest, handleLogout } =
    useHeaderFeature();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {taskStats.completed}/{taskStats.total} completed
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Button
            onPress={toggleTheme}
            variant="ghost"
            size="medium"
            icon={mode === "light" ? "moon-outline" : "sunny-outline"}
            iconOnly
          />

          <Button onPress={onAddTask} variant="ghost" size="medium" icon="add" iconOnly />

          <Button onPress={handleToggleDebugOptions} variant="ghost" size="medium" icon="settings-outline" iconOnly />

          <Button onPress={handleLogout} variant="ghost" size="medium" icon="log-out-outline" iconOnly />
        </View>
      </View>

      {/* debug panel for performance testing */}
      {showDebugOptions && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>Performance Testing</Text>
          <View style={styles.debugButtons}>
            <Button
              title="Small (3)"
              onPress={() => handleDatasetTest("small", onRefresh)}
              variant="outline"
              size="small"
            />
            <Button
              title="Large (150)"
              onPress={() => handleDatasetTest("large", onRefresh)}
              variant="outline"
              size="small"
            />
            <Button
              title="Stress (650)"
              onPress={() => handleDatasetTest("stress", onRefresh)}
              variant="outline"
              size="small"
            />
          </View>
        </View>
      )}
    </>
  );
};
