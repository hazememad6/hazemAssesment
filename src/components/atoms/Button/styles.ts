import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

interface UseButtonStylesProps {
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "small" | "medium" | "large";
  disabled: boolean;
  iconOnly?: boolean;
}

export const useButtonStyles = ({ variant, size, disabled, iconOnly }: UseButtonStylesProps) => {
  const { moderateScale, horizontalScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  const getButtonPadding = () => {
    if (iconOnly) {
      switch (size) {
        case "small":
          return moderateScale(Dimensions.primarySpace);
        case "large":
          return moderateScale(Dimensions.sectionSpace);
        default:
          return moderateScale(Dimensions.secondarySpace);
      }
    }

    switch (size) {
      case "small":
        return {
          paddingHorizontal: horizontalScale(Dimensions.secondarySpace),
          paddingVertical: verticalScale(Dimensions.primarySpace),
        };
      case "large":
        return {
          paddingHorizontal: horizontalScale(Dimensions.extraSpace),
          paddingVertical: verticalScale(Dimensions.sectionSpace),
        };
      default:
        return {
          paddingHorizontal: horizontalScale(Dimensions.sectionSpace),
          paddingVertical: verticalScale(Dimensions.secondarySpace),
        };
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.secondary;
      case "outline":
      case "ghost":
        return "transparent";
      default:
        return theme.colors.primary;
    }
  };

  const getBorderColor = () => {
    if (variant === "outline") return theme.colors.primary;
    return "transparent";
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.border;
    if (variant === "outline" || variant === "ghost") return theme.colors.primary;
    return "#ffffff";
  };

  const padding = getButtonPadding();
  const flexDirection = iconOnly ? "column" : "row";

  const buttonStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: moderateScale(iconOnly ? 20 : Dimensions.borderRadius),
    borderWidth: variant === "outline" ? moderateScale(1) : 0,
    borderColor: getBorderColor(),
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: flexDirection as "row" | "column",
    opacity: disabled ? 0.6 : 1,
  };

  // Handle padding for icon-only vs regular buttons
  const finalButtonStyle = iconOnly
    ? {
        ...buttonStyle,
        padding: padding as number,
        width: moderateScale(44),
        height: moderateScale(44),
      }
    : {
        ...buttonStyle,
        ...(padding as object),
      };

  return StyleSheet.create({
    buttonStyle: finalButtonStyle,
    textStyle: {
      fontSize: moderateScale(
        size === "small" ? Dimensions.smallFont : size === "large" ? Dimensions.largeFont : Dimensions.regularFont
      ),
      fontWeight: "600" as const,
      color: getTextColor(),
    },
  });
};
