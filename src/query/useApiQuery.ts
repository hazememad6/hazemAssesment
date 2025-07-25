import { AxiosError } from "axios";
import { QueryFunction, QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useApiQuery<TData = unknown, TError = AxiosError, TKey = string | QueryKey>(
  key: TKey,
  queryFn: QueryFunction<TData, QueryKey>,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const queryKey: QueryKey = Array.isArray(key) ? key : [key];

  return useQuery<TData, TError, TData, QueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}
