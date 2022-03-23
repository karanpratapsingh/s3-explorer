import { useMutation } from 'react-query';
import { PresignRequest, PresignResponse, presignUrl } from '../api';
import { ApiMutationResult } from './options';

export function usePresignUrl(
  key: string,
): ApiMutationResult<PresignResponse, PresignRequest> {
  const {
    mutate,
    data,
    isLoading: loading,
    error,
  } = useMutation<PresignResponse, unknown, PresignRequest>(
    ['objects-presign', key],
    (request: PresignRequest) => presignUrl(request),
  );

  return { mutate, data, loading, error };
}
