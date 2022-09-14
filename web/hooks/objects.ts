import { useMutation } from 'react-query';
import {
  deleteObject,
  DeleteRequest,
  DeleteResponse,
  PresignRequest,
  PresignResponse,
  presignUrl
} from '../api';
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
    ['presign-object', key],
    (request: PresignRequest) => presignUrl(request),
  );

  return { mutate, data, loading, error };
}

export function useDeleteObject(
  key: string,
): ApiMutationResult<DeleteResponse, DeleteRequest> {
  const {
    mutate,
    data,
    isLoading: loading,
    error,
  } = useMutation<DeleteResponse, unknown, DeleteRequest>(
    ['delete-object', key],
    (request: DeleteRequest) => deleteObject(request),
  );

  return { mutate, data, loading, error };
}
