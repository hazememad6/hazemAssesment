import React from "react";
import { Text, TextInput, View } from "react-native";
import { useThemeStore } from "@store/themeStore";
import { useInputStyles } from "./styles";
import { InputProps } from "./types";

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = "sentences",
  keyboardType = "default",
  autoFocus = false,
}) => {
  const { containerStyle, inputStyle, labelStyle, errorStyle } = useInputStyles({
    error,
    multiline,
  });
  const { theme } = useThemeStore();

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.border}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
      />
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};
