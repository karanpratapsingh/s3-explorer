export type ApiError = {
  err: string;
};

export type Bucket = {
  name: string;
  creationDate: Date;
};

export type BucketsResponse = {
  buckets: Bucket[];
  total: number;
};
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

export enum PresignTimeUnit {
  Hour = 'h',
  Minute = 'm',
  Second = 's',
}

export type PresignRequest = {
  bucket: string;
  key: string;
  duration: `${string}${PresignTimeUnit}`;
};

export type PresignResponse = {
  url: string;
};
