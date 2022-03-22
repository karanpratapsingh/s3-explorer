import { Spacer, Popover, Text } from '@geist-ui/core';
import File from '@geist-ui/icons/file';
import Folder from '@geist-ui/icons/folder';
import MoreVertical from '@geist-ui/icons/moreVertical';
import clsx from 'clsx';
import React from 'react';
import { S3Object, S3ObjectType } from '../api';
import { formatBytes } from '../utils/shared';

export enum ActionType {
  Share,
  Move,
  Delete,
}

interface ObjectListItemProps {
  object: S3Object;
  onNext: (key: string) => void;
  onAction: (key: string, action: ActionType) => void;
}

export default function ObjectListItem(
  props: ObjectListItemProps,
): React.ReactElement {
  const { object, onNext, onAction } = props;
  const { name, key, type, size } = object;

  const isFile = type === S3ObjectType.FILE;

  const onClick = () => !isFile && onNext(key);

  let icon: React.ReactNode = null;

  switch (type) {
    case S3ObjectType.FILE:
      icon = <File size={20} />;
      break;
    case S3ObjectType.FOLDER:
      icon = <Folder size={20} />;
      break;
  }

  const popoverContent = () => (
    <div className='w-24 flex flex-col items-center'>
      <Popover.Item>
        <Text
          span
          className='cursor-pointer'
          onClick={() => onAction(key, ActionType.Share)}
        >
          Share
        </Text>
      </Popover.Item>
      <Popover.Item>
        <Text
          span
          className='cursor-pointer'
          type='warning'
          onClick={() => onAction(key, ActionType.Move)}
        >
          Move
        </Text>
      </Popover.Item>
      <Popover.Item>
        <Text
          span
          className='cursor-pointer'
          type='error'
          onClick={() => onAction(key, ActionType.Delete)}
        >
          Delete
        </Text>
      </Popover.Item>
    </div>
  );

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
            <Popover content={popoverContent} placement='left'>
              <MoreVertical className='cursor-pointer' size={18} />
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
