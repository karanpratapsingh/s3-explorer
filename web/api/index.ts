import config from '../config';

export type Bucket = {
  name: string;
  creationDate: Date;
};

export type BucketsResponse = {
  buckets: Bucket[];
  total: number;
};

export async function listBuckets(): Promise<BucketsResponse> {
  return await fetch(`${config.apiURL}/api/buckets/list`).then(res =>
    res.json(),
  );
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
