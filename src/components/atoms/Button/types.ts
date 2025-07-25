import { TouchableOpacityProps } from "react-native";

export interface ButtonProps extends Omit<TouchableOpacityProps, "onPress"> {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconOnly?: boolean;
}
