import { Controller, FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@components/atoms";
import { InputFormControllerProps } from "./types";
import React from "react";

// wrapper for react-hook-form + input combo
// honestly could just use the Input directly but this makes form validation easier
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
