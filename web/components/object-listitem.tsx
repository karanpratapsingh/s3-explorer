import { Card, Popover, Spacer, Text } from '@geist-ui/core';
import File from '@geist-ui/icons/file';
import Folder from '@geist-ui/icons/folder';
import MoreVertical from '@geist-ui/icons/moreVertical';
import clsx from 'clsx';
import React from 'react';
import { S3Object, S3ObjectType } from '../api';
import { formatBytes } from '../utils/shared';

export enum LayoutType {
  List = 'List',
  Grid = 'Grid',
}

export enum ActionType {
  Share,
  Move,
  Delete,
}

interface ObjectListItemProps {
  layoutType: LayoutType;
  object: S3Object;
  onNext: (key: string) => void;
  onAction: (key: string, action: ActionType) => void;
}

export default function ObjectListItem(
  props: ObjectListItemProps,
): React.ReactElement {
  const { object, layoutType, onNext, onAction } = props;
  const { name, key, type, size } = object;

  const isFile = type === S3ObjectType.FILE;

  const onClick = () => !isFile && onNext(key);

  const popoverContent: React.ReactNode = () => (
    <div className='w-20 flex flex-col items-center'>
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
          type='error'
          onClick={() => onAction(key, ActionType.Delete)}
        >
          Delete
        </Text>
      </Popover.Item>
    </div>
  );

  let item = (
    <div
      className={clsx(
        'flex items-center justify-between fade-in',
        !isFile && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      <div className='flex items-center'>
        {getIcon(type, 20)}
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

  if (layoutType === LayoutType.Grid) {
    item = (
      <Popover content={popoverContent} placement='right'>
        <Card
          width='10.25rem'
          className='fade-in cursor-pointer'
          onClick={onClick}
        >
          <div className='flex items-center justify-center'>
            {getIcon(type, 40)}
          </div>
          <p className='text-sm text-center font-light truncate text-ellipsis'>
            {name}
          </p>
          {size && (
            <p className='text-secondary text-sm font-light'>
              {formatBytes(size)}
            </p>
          )}
        </Card>
      </Popover>
    );
  }

  return item;
}

function getIcon(type: S3ObjectType, size: number): React.ReactNode {
  let icon: React.ReactNode = null;

  switch (type) {
    case S3ObjectType.FILE:
      icon = <File size={size} />;
      break;
    case S3ObjectType.FOLDER:
      icon = <Folder size={size} />;
      break;
  }

  return icon;
}
