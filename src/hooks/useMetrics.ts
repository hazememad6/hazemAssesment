import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

// responsive design helper - stolen from some tutorial but works great
export const useMetrics = () => {
  const { width, height } = useWindowDimensions();

  // design dimensions - probably should be constants somewhere
  const { dw, dh } = { dw: 360, dh: 780 };

  const designWidth = useMemo(() => (width > height ? dh : dw), [width, height, dh, dw]);
  const designHeight = useMemo(() => (width > height ? dw : dh), [width, height, dh, dw]);

  // horizontal scaling for widths and stuff
  const horizontalScale = (size: number) => (width / designWidth) * size;

  // vertical scaling for heights
  const verticalScale = (size: number) => (height / designHeight) * size;

  // moderate scaling for fonts - prevents crazy big text on tablets
  const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

  // helper for padding/margin - saves some typing
  const horizontalVertical = (key: "margin" | "padding", value: number, values?: { x: number; y: number }) => {
    const horizontalValue = horizontalScale(values ? values.x : value);
    const verticalValue = verticalScale(values ? values.y : value);
    return {
      [`${key}Horizontal`]: horizontalValue,
      [`${key}Vertical`]: verticalValue,
    };
  };

  // circle helper - used for avatars and buttons
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
