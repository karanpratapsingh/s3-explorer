import toLower from 'lodash/toLower';
import { S3Object } from '../api';
import { defaultParams } from './aws';

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getPreviousKey(key: string): string {
  const updatedPaths = key.split(defaultParams.Delimiter);

  updatedPaths.splice(-2, 1);

  if (updatedPaths.length === 1 && updatedPaths[0] === '') {
    updatedPaths.pop();
    updatedPaths.push(defaultParams.Prefix);
  }

  return updatedPaths.join(defaultParams.Delimiter);
}

export function filterObjects(search: string, objects: S3Object[]): S3Object[] {
  return [...objects].filter(
    (object: S3Object) => toLower(object.name).search(toLower(search)) !== -1,
  );
}
