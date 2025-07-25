import React from "react";
import { Controller, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@components/atoms";
import { InputFormControllerProps } from "./types";

export const InputFormController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  ...inputProps
}: InputFormControllerProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input {...inputProps} value={value || ""} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
      )}
    />
  );
};
