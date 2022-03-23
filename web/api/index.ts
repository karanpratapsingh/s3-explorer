import config from '../config';
import type {
  BucketsResponse,
  NavigateRequest,
  NavigateResponse,
  PresignRequest,
  PresignResponse,
} from './types';

export async function listBuckets(): Promise<BucketsResponse> {
  return await fetch(`${config.apiURL}/api/buckets/list`).then(res =>
    res.json(),
  );
}

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

export async function presignUrl(
  request: PresignRequest,
): Promise<PresignResponse> {
  return await fetch(`${config.apiURL}/api/objects/presign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(res => res.json());
}

export * from './types';
