import { Dimensions } from "@utils";
import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";

export const useHeaderStyles = () => {
  const { theme } = useThemeStore();
  const { moderateScale, horizontalScale, verticalScale } = useMetrics();

  return StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: horizontalScale(Dimensions.sectionSpace),
      paddingVertical: verticalScale(Dimensions.primarySpace),
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: moderateScale(Dimensions.xxLargeFont),
      fontWeight: "bold",
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: moderateScale(Dimensions.xSmallFont),
      color: theme.colors.text,
      opacity: 0.7,
      marginTop: verticalScale(Dimensions.tinySpace),
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(Dimensions.primarySpace),
    },
    debugPanel: {
      backgroundColor: theme.colors.card,
      padding: horizontalScale(Dimensions.sectionSpace),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    debugTitle: {
      fontSize: moderateScale(Dimensions.regularFont),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(Dimensions.primarySpace),
    },
    debugButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      gap: horizontalScale(Dimensions.primarySpace),
    },
  });
};
