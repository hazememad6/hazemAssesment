import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useTaskListStyles = () => {
  const { moderateScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  const contentContainerStyle = {
    flexGrow: 1,
    paddingVertical: verticalScale(Dimensions.primarySpace),
  };

  // FlashList only supports padding and backgroundColor
  const flashListContentContainerStyle = {
    paddingVertical: verticalScale(Dimensions.primarySpace),
  };

  const emptyContainerStyle = {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: verticalScale(Dimensions.emptyStateSpacing),
  };

  const emptyTextStyle = {
    fontSize: moderateScale(Dimensions.regularFont),
    color: theme.colors.text,
    textAlign: "center" as const,
    opacity: 0.6,
  };

  const flatListStyle = {
    flex: 1,
  };

  return StyleSheet.create({
    contentContainerStyle,
    flashListContentContainerStyle,
    emptyContainerStyle,
    emptyTextStyle,
    flatListStyle,
  });
};
