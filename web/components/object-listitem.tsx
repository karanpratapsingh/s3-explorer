import { Spacer } from '@geist-ui/core';
import File from '@geist-ui/icons/file';
import Folder from '@geist-ui/icons/folder';
import MoreVertical from '@geist-ui/icons/moreVertical';
import clsx from 'clsx';
import React from 'react';
import { S3Object, S3ObjectType } from '../api';
import { formatBytes } from '../utils/shared';

interface ObjectListItemProps {
  object: S3Object;
  onNext: (path: string) => void;
}

export default function ObjectListItem(
  props: ObjectListItemProps,
): React.ReactElement {
  const { object, onNext } = props;
  const { name, type, size } = object;

  const isFile = type === S3ObjectType.FILE;

  const onClick = () => !isFile && onNext(name);

  let icon: React.ReactNode = null;

  switch (type) {
    case S3ObjectType.FILE:
      icon = <File size={20} />;
      break;
    case S3ObjectType.FOLDER:
      icon = <Folder size={20} />;
      break;
  }

  return (
    <div
      className={clsx(
        'p-1 mb-2 flex items-center justify-between',
        !isFile && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      <div className='flex items-center'>
        {icon}
        <Spacer w={0.5} />
        <span className='text-sm font-light'>{name}</span>
      </div>

      <div className='flex items-center'>
        {size && (
          <span className='text-secondary text-sm font-light'>
            {formatBytes(size)}
          </span>
        )}
        {isFile && (
          <>
            <Spacer w={2} />
            <MoreVertical className='cursor-pointer' size={18} />
          </>
        )}
      </div>
    </div>
  );
}
