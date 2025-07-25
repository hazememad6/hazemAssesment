import { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { InputProps } from "@components/atoms/Input/types";

export interface InputFormControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputProps, "value" | "onChangeText" | "onBlur" | "error"> {
  control: Control<TFieldValues>;
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
}
