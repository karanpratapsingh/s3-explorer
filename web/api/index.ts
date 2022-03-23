import { http } from '../utils/http';
import type {
  BucketsResponse,
  NavigateRequest,
  NavigateResponse,
  PresignRequest,
  PresignResponse,
} from './types';

export async function listBuckets(): Promise<BucketsResponse> {
  return http<BucketsResponse>('/api/buckets/list');
}

export async function navigateBucket(
  request: NavigateRequest,
): Promise<NavigateResponse> {
  return http<NavigateResponse, NavigateRequest>(
    '/api/buckets/navigate',
    'POST',
    request,
  );
}

export async function presignUrl(
  request: PresignRequest,
): Promise<PresignResponse> {
  return http<PresignResponse, PresignRequest>(
    '/api/objects/presign',
    'POST',
    request,
  );
}

export * from './types';
