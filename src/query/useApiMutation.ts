import { AxiosError } from "axios";
import { MutationKey, UseMutationOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "../providers/reactQueryProvider";

type MutationFn<TVariables, TResponse> = (vars: TVariables) => Promise<TResponse>;

type ExtraOptions = {
  invalidate?: MutationKey[];
};

export function useApiMutation<TVariables = void, TResponse = unknown, TContext = unknown>(
  key: MutationKey | string,
  mutationFn: MutationFn<TVariables, TResponse>,
  options?: Omit<UseMutationOptions<TResponse, AxiosError, TVariables, TContext>, "mutationKey" | "mutationFn"> &
    ExtraOptions
) {
  const { invalidate, ...restOptions } = options ?? {};

  const mutationKey: MutationKey = Array.isArray(key) ? key : [key];

  return useMutation<TResponse, AxiosError, TVariables, TContext>({
    mutationKey,
    mutationFn,
    ...restOptions,
    onSuccess: async (data, variables, context) => {
      await restOptions?.onSuccess?.(data, variables, context);
      invalidate?.forEach((qKey) => queryClient.invalidateQueries({ queryKey: qKey }));
    },
  });
}
