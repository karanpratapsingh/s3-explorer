import toLower from 'lodash/toLower';
import { S3Object } from '../hooks/buckets';
import { defaultParams } from './aws';

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getUpdatedPath(paths: string[], path: string): string[] {
  const updatedPaths = paths.slice();
  updatedPaths.pop();
  updatedPaths.push(path);
  updatedPaths.push('');

  return updatedPaths;
}

export function getKeyFromPath(paths: string[], object?: string): string {
  const updatedPaths = [...paths];

  if (object) {
    updatedPaths.pop();
    updatedPaths.push(object);
  }

  return updatedPaths.join('/');
}

export function getPreviousPaths(paths: string[]): string[] {
  const updatedPaths = paths.slice();

  updatedPaths.splice(-2, 1);
  if (updatedPaths.length === 1 && updatedPaths[0] === '') {
    updatedPaths.pop();
    updatedPaths.push(defaultParams.Prefix);
  }

  return updatedPaths;
}

export enum FileType {
  video = 'video',
  text = 'text',
  unknown = 'unknown',
}

export function getContentType(name: string): FileType {
  const type = getFileType(name);

  if (['mp4', 'm4v', 'avi', 'mkv'].includes(type)) return FileType.video;
  if (['srt'].includes(type)) return FileType.text;

  return FileType.unknown;
}

export function getFileType(name: string): string {
  const nameParts: string[] = name.split('.');
  const type = nameParts[nameParts.length - 1];
  return type;
}

export function getMimeType(name: string | null): string {
  if (!name) return '';
  const contentType = getContentType(name);
  let fileType = getFileType(name);

  if (['mkv', 'm4v'].includes(fileType)) {
    fileType = 'webm';
  }

  return `${contentType}/${fileType}`;
}

export function filterObjects(search: string, objects: S3Object[]): S3Object[] {
  return [...objects].filter(
    (object: S3Object) => toLower(object.name).search(toLower(search)) !== -1,
  );
}
