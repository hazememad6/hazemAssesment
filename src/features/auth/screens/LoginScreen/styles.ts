import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useLoginScreenStyles = () => {
  const { moderateScale, horizontalScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: horizontalScale(Dimensions.extraSpace),
      paddingVertical: verticalScale(Dimensions.screenPadding),
    },
    welcomeContainer: {
      alignItems: "center",
      marginBottom: verticalScale(Dimensions.screenPadding),
    },
    welcomeTitle: {
      fontSize: moderateScale(Dimensions.xxxLargeFont),
      fontWeight: "bold" as const,
      color: theme.colors.text,
      marginBottom: verticalScale(Dimensions.primarySpace),
    },
    welcomeSubtitle: {
      fontSize: moderateScale(Dimensions.regularFont),
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: "center" as const,
    },
    formContainer: {
      width: "100%",
    },
    buttonContainer: {
      marginTop: verticalScale(Dimensions.sectionSpace),
    },
    credentialsContainer: {
      marginTop: verticalScale(Dimensions.circleSpace),
      padding: horizontalScale(Dimensions.sectionSpace),
      backgroundColor: theme.colors.card,
      borderRadius: moderateScale(Dimensions.borderRadius),
    },
    credentialsTitle: {
      fontSize: moderateScale(Dimensions.xSmallFont),
      color: theme.colors.text,
      opacity: 0.8,
      textAlign: "center" as const,
      marginBottom: verticalScale(Dimensions.primarySpace),
    },
    credentialsText: {
      fontSize: moderateScale(Dimensions.smallFont),
      color: theme.colors.text,
      opacity: 0.6,
      textAlign: "center" as const,
    },
  });
};
