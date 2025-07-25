import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useGenericFlashListStyles = () => {
  const { moderateScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  return StyleSheet.create({
    contentContainer: {
      paddingVertical: verticalScale(Dimensions.primarySpace),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(Dimensions.emptyStateSpacing),
    },
    emptyText: {
      fontSize: moderateScale(Dimensions.regularFont),
      color: theme.colors.text,
      textAlign: "center",
      opacity: 0.6,
    },
  });
};
