import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";
import { Task } from "src/types/task";

export const useTaskItemStyles = (task: Task) => {
  const { moderateScale, horizontalScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();

  const containerStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: moderateScale(Dimensions.secondarySpace),
    padding: horizontalScale(Dimensions.sectionSpace),
    marginBottom: verticalScale(Dimensions.secondarySpace),
    borderLeftWidth: moderateScale(Dimensions.tinySpace),
    borderLeftColor: task.completed ? theme.colors.success : theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.84),
    elevation: 5,
  };

  const rowStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  };

  const checkboxStyle = {
    marginRight: horizontalScale(Dimensions.secondarySpace),
  };

  const contentStyle = {
    flex: 1,
    marginRight: horizontalScale(Dimensions.secondarySpace),
  };

  const titleStyle = {
    fontSize: moderateScale(Dimensions.regularFont),
    fontWeight: "600" as const,
    color: theme.colors.text,
    textDecorationLine: task.completed ? ("line-through" as const) : ("none" as const),
    opacity: task.completed ? 0.7 : 1,
  };

  const descriptionStyle = {
    fontSize: moderateScale(Dimensions.smallFont),
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: verticalScale(Dimensions.primarySpace),
  };

  const dateStyle = {
    fontSize: moderateScale(Dimensions.smallFont),
    color: theme.colors.text,
    opacity: 0.5,
    marginTop: verticalScale(Dimensions.primarySpace),
  };

  const actionsStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: horizontalScale(Dimensions.secondarySpace),
  };

  return StyleSheet.create({
    containerStyle,
    rowStyle,
    checkboxStyle,
    contentStyle,
    titleStyle,
    descriptionStyle,
    dateStyle,
    actionsStyle,
  });
};
