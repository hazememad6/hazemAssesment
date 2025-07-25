import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export const useMetrics = () => {
  const { width, height } = useWindowDimensions();
  //design width and height
  const { dw, dh } = { dw: 360, dh: 780 };

  const designWidth = useMemo(() => (width > height ? dh : dw), [width, height, dh, dw]);
  const designHeight = useMemo(() => (width > height ? dw : dh), [width, height, dh, dw]);

  // width, marginHorizontal(right,left), marginHorizontal(right,left), paddingHorizontal(right,left),
  const horizontalScale = (size: number) => (width / designWidth) * size;

  // height, marginVertical(top,bottom), marginVertical(top,bottom), paddingVertical(top,bottom),
  const verticalScale = (size: number) => (height / designHeight) * size;

  //fontsize, borderRadius
  const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

  // padding, margin
  const horizontalVertical = (key: "margin" | "padding", value: number, values?: { x: number; y: number }) => {
    const horizontalValue = horizontalScale(values ? values.x : value);
    const verticalValue = verticalScale(values ? values.y : value);
    return {
      [`${key}Horizontal`]: horizontalValue,
      [`${key}Vertical`]: verticalValue,
    };
  };
  const circleView = (value: number) => ({
    height: moderateScale(value),
    width: moderateScale(value),
    borderRadius: moderateScale(value / 2),
  });

  return {
    horizontalScale,
    verticalScale,
    moderateScale,
    horizontalVertical,
    circleView,
    portraitMode: width > height,
    width,
    height,
  };
};
