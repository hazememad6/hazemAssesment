import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useAddTaskModalStyles = () => {
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
    },
    headerTitle: {
      fontSize: moderateScale(Dimensions.largeFont),
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      padding: moderateScale(Dimensions.primarySpace),
      color: theme.colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: horizontalScale(Dimensions.extraSpace),
      paddingVertical: verticalScale(Dimensions.sectionSpace),
    },
    inputGroup: {
      marginBottom: verticalScale(Dimensions.extraSpace),
    },
    label: {
      fontSize: moderateScale(Dimensions.regularFont),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(Dimensions.primarySpace),
    },
    input: {
      borderWidth: moderateScale(1),
      borderColor: theme.colors.border,
      borderRadius: moderateScale(Dimensions.primarySpace),
      padding: moderateScale(Dimensions.secondarySpace),
      fontSize: moderateScale(Dimensions.regularFont),
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },
    textArea: {
      height: verticalScale(100),
      textAlignVertical: "top",
    },
  });
};
