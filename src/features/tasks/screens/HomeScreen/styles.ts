import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useHomeScreenStyles = () => {
  const { moderateScale, horizontalScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: horizontalScale(Dimensions.extraSpace),
      paddingVertical: verticalScale(Dimensions.sectionSpace),
      borderBottomWidth: moderateScale(1),
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: moderateScale(Dimensions.xxLargeFont),
      fontWeight: "bold" as const,
      color: theme.colors.text,
    },
    headerSubtitle: {
      fontSize: moderateScale(Dimensions.xSmallFont),
      color: theme.colors.text,
      opacity: 0.7,
      marginTop: verticalScale(2),
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(Dimensions.primarySpace),
    },
    actionButton: {
      padding: moderateScale(Dimensions.primarySpace),
      borderRadius: moderateScale(20),
      backgroundColor: theme.colors.card,
    },
    themeButton: {
      padding: moderateScale(Dimensions.primarySpace),
      marginRight: horizontalScale(Dimensions.primarySpace),
    },
    debugPanel: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: horizontalScale(Dimensions.extraSpace),
      paddingVertical: verticalScale(Dimensions.secondarySpace),
      borderBottomWidth: moderateScale(1),
      borderBottomColor: theme.colors.border,
    },
    debugTitle: {
      fontSize: moderateScale(Dimensions.regularFont),
      fontWeight: "600" as const,
      color: theme.colors.text,
      marginBottom: verticalScale(Dimensions.primarySpace),
    },
    debugSection: {
      marginTop: verticalScale(Dimensions.secondarySpace),
    },
    debugSubtitle: {
      fontSize: moderateScale(Dimensions.smallFont),
      fontWeight: "500" as const,
      color: theme.colors.text,
      marginBottom: verticalScale(Dimensions.primarySpace),
    },
    debugButtons: {
      flexDirection: "row",
      gap: horizontalScale(Dimensions.primarySpace),
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: horizontalScale(Dimensions.extraSpace),
      paddingTop: verticalScale(Dimensions.sectionSpace),
    },
    errorContainer: {
      backgroundColor: theme.colors.error,
      padding: moderateScale(Dimensions.secondarySpace),
      borderRadius: moderateScale(Dimensions.borderRadius),
      marginBottom: verticalScale(Dimensions.sectionSpace),
    },
    errorText: {
      color: "#ffffff",
      fontSize: moderateScale(Dimensions.xSmallFont),
      textAlign: "center" as const,
    },
  });
};
