import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { ButtonProps } from "./types";
import { Dimensions } from "@utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useButtonStyles } from "./styles";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";

// button component - probably could clean this up but whatever
// started simple then kept adding stuff as needed
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconOnly = false,
  ...rest
}) => {
  const { buttonStyle, textStyle } = useButtonStyles({
    variant,
    size,
    disabled,
    iconOnly,
  });
  const { theme } = useThemeStore();
  const { moderateScale } = useMetrics();

  // if (__DEV__) console.log('button render', title);

  const getIconSize = () => {
    // could make this a util function but eh
    switch (size) {
      case "small":
        return moderateScale(Dimensions.smallIcon);
      case "large":
        return moderateScale(Dimensions.largeIcon);
      default:
        return moderateScale(Dimensions.regularIcon);
    }
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.border;
    if (variant === "outline" || variant === "ghost") return theme.colors.primary;
    return "#ffffff";
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? theme.colors.primary : "#ffffff"}
        />
      );
    }

    if (iconOnly && icon) {
      return <Ionicons name={icon as any} size={getIconSize()} color={getIconColor()} />;
    }

    if (icon && title) {
      return (
        <>
          <Ionicons
            name={icon as any}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginRight: moderateScale(Dimensions.primarySpace) }}
          />
          <Text style={textStyle}>{title}</Text>
        </>
      );
    }

    return title ? <Text style={textStyle}>{title}</Text> : null;
  };

  const handlePress = () => {
    // maybe add haptic feedback here someday
    if (onPress && !disabled && !loading) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={disabled || loading ? 1 : 0.7}
      accessibilityRole="button"
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
