import { ActivityIndicator, Text, View } from "react-native";

import { LoadingSpinnerProps } from "./types";
import React from "react";
import { useLoadingSpinnerStyles } from "./styles";
import { useThemeStore } from "@store/themeStore";

// simple spinner component - nothing fancy
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "large", text, color }) => {
  const { containerStyle, textStyle } = useLoadingSpinnerStyles();
  const { theme } = useThemeStore();
  const spinnerColor = color || theme.colors.primary;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && <Text style={textStyle}>{text}</Text>}
    </View>
  );
};
