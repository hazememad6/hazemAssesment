import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useThemeStore } from "@store/themeStore";
import { useLoadingSpinnerStyles } from "./styles";
import { LoadingSpinnerProps } from "./types";

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
