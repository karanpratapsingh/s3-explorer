import { useQuery } from 'react-query';
import config from '../config';
import { ApiQueryResult } from './types';

export type Bucket = {
  name: string;
  creationDate: Date;
};

type BucketsResponse = {
  buckets: Bucket[];
  total: number;
};

export async function listBuckets(): Promise<BucketsResponse> {
  return await fetch(`${config.apiURL}/api/buckets/list`).then(res =>
    res.json(),
  );
}

export function useListBuckets(): ApiQueryResult<BucketsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<BucketsResponse, Error>('buckets-list', listBuckets);

  return { data, loading, error };
}

export type NavigateRequest = {
  bucket: string;
  prefix: string;
};

export enum S3ObjectType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export type S3Object = {
  name: string;
  key: string;
  size: number | null;
  type: S3ObjectType;
};

export type NavigateResponse = {
  objects: S3Object[];
};

export async function navigateBucket(
  request: NavigateRequest,
): Promise<NavigateResponse> {
  return await fetch(`${config.apiURL}/api/buckets/navigate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(res => res.json());
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
