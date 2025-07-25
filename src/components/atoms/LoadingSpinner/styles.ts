import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useLoadingSpinnerStyles = () => {
  const { moderateScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  const containerStyle = {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: theme.colors.background,
  };

  const textStyle = {
    marginTop: verticalScale(Dimensions.secondarySpace),
    fontSize: moderateScale(Dimensions.regularFont),
    color: theme.colors.text,
    textAlign: "center" as const,
  };

  return StyleSheet.create({
    containerStyle,
    textStyle,
  });
};
