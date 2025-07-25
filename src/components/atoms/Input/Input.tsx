import { Text, TextInput, View } from "react-native";

import { InputProps } from "./types";
import React from "react";
import { useInputStyles } from "./styles";
import { useThemeStore } from "@store/themeStore";

// this input component is kinda messy but it works lol
// tried to make it fancy but honestly keeping it simple for now
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

  // console.log('input render', value); // uncomment when debugging

  // idk why but i always extract colors instead of using them inline
  const placeholderColor = theme.colors.border;

  const handleTextChange = (text: string) => {
    // maybe add validation here later? idk
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleBlur = () => {
    // validation on blur is less annoying than onChange
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        returnKeyType={multiline ? "default" : "done"}
        textAlignVertical={multiline ? "top" : "center"}
      />

      {/* only show error if there is one */}
      {error && error.length > 0 && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};
