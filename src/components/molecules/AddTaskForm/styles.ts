import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";

export const useAddTaskFormStyles = () => {
  const { moderateScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  const containerStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: moderateScale(Dimensions.secondarySpace),
    padding: moderateScale(Dimensions.sectionSpace),
    marginBottom: verticalScale(Dimensions.extraSpace),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const titleStyle = {
    fontSize: moderateScale(Dimensions.largeFont),
    fontWeight: "600" as const,
    color: theme.colors.text,
    marginBottom: verticalScale(Dimensions.sectionSpace),
  };

  return StyleSheet.create({
    containerStyle,
    titleStyle,
  });
};
