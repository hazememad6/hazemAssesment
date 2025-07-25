import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";
import { useButtonStyles } from "./styles";
import { ButtonProps } from "./types";

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

  const getIconSize = () => {
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
      return <Ionicons name={icon as any} size={getIconSize()} color={getIconColor()} testID={`icon-${icon}`} />;
    }

    if (icon && title) {
      return (
        <>
          <Ionicons
            name={icon as any}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginRight: moderateScale(Dimensions.primarySpace) }}
            testID={`icon-${icon}`}
          />
          <Text style={textStyle}>{title}</Text>
        </>
      );
    }

    return <Text style={textStyle}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
