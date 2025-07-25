import { StyleSheet } from "react-native";
import { useMetrics } from "@hooks/useMetrics";
import { useThemeStore } from "@store/themeStore";
import { Dimensions } from "@utils";
import { InputProps } from "./types";

export const useInputStyles = (props: Pick<InputProps, "error" | "multiline">) => {
  const { moderateScale, horizontalScale, verticalScale } = useMetrics();
  const { theme } = useThemeStore();
  const { error, multiline = false } = props;

  const containerStyle = {
    marginBottom: verticalScale(Dimensions.sectionSpace),
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    borderRadius: moderateScale(Dimensions.borderRadius),
    paddingHorizontal: horizontalScale(Dimensions.secondarySpace),
    paddingVertical: verticalScale(Dimensions.secondarySpace),
    fontSize: moderateScale(Dimensions.regularFont),
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: multiline ? verticalScale(Dimensions.multilineInputHeight) : verticalScale(Dimensions.inputHeight),
  };

  const labelStyle = {
    fontSize: moderateScale(Dimensions.xSmallFont),
    fontWeight: "600" as const,
    color: theme.colors.text,
    marginBottom: verticalScale(Dimensions.tinySpace),
  };

  const errorStyle = {
    fontSize: moderateScale(Dimensions.smallFont),
    color: theme.colors.error,
    marginTop: verticalScale(Dimensions.tinySpace),
  };

  return StyleSheet.create({
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
  });
};
