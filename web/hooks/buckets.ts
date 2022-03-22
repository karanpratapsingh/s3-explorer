import { useQuery } from 'react-query';
import {
  BucketsResponse,
  listBuckets,
  navigateBucket,
  NavigateResponse,
} from '../api';
import { ApiQueryResult } from './options';

export function useListBuckets(): ApiQueryResult<BucketsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<BucketsResponse, Error>('buckets-list', listBuckets);

  return { data, loading, error };
}

export function useNavigateBucket(
  bucket: string,
  prefix: string,
): ApiQueryResult<NavigateResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<NavigateResponse, Error>(
    ['buckets-navigate', prefix],
    () => navigateBucket({ bucket, prefix }),
    {
      enabled: bucket !== '',
    },
  );

  return { data, loading, error };
}
