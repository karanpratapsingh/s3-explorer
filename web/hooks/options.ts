import { useToasts } from '@geist-ui/core';
import { useEffect } from 'react';
import { UseMutateFunction } from 'react-query';
import { ApiError } from '../api';

export const options = {
  refetchInterval: 5 * 1000,
};

export interface ApiResult<T, E = Error | unknown> {
  data: T | undefined;
  loading: boolean;
  error: E | null;
}

export interface ApiQueryResult<T, E = Error> extends ApiResult<T, E> {
  refetch?: VoidFunction;
}

export interface ApiMutationResult<T, V, E = unknown> extends ApiResult<T, E> {
  mutate: UseMutateFunction<T, E, V>;
}

export function useNotifyError<T>({
  data,
  loading,
  error,
}: ApiResult<T | ApiError>) {
  const { setToast } = useToasts();

  useEffect(() => {
    const error = (data as ApiError)?.err;

    if (error) {
      setToast({ type: 'error', text: error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error]);
}
