import {
  Breadcrumbs,
  Description,
  Input,
  Select,
  Spacer,
  Text,
  useToasts,
} from '@geist-ui/core';
import AlertCircle from '@geist-ui/icons/AlertCircle';
import Archive from '@geist-ui/icons/archive';
import ChevronLeft from '@geist-ui/icons/ChevronLeft';
import Database from '@geist-ui/icons/database';
import File from '@geist-ui/icons/file';
import Folder from '@geist-ui/icons/folder';
import Info from '@geist-ui/icons/Info';
import MoreVertical from '@geist-ui/icons/moreVertical';
import Search from '@geist-ui/icons/Search';
import clsx from 'clsx';
import defaultTo from 'lodash/defaultTo';
import React, { useMemo, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { Bucket, S3Object, S3ObjectType } from '../api';
import config from '../config';
import { useListBuckets, useNavigateBucket } from '../hooks/buckets';
import { defaultParams } from '../utils/aws';
import {
  formatBytes,
  getKeyFromPath,
  getPreviousPaths,
  getUpdatedPath,
} from '../utils/shared';
import { Colors } from '../utils/theme';

export default function Home(): React.ReactElement {
  const { setToast } = useToasts();
  const [bucket, setBucket] = useState<string | null>(defaultParams.Bucket);
  const [paths, setPaths] = useState<string[]>([defaultParams.Prefix]);

  const key = useMemo(() => getKeyFromPath(paths), [paths]);

  const { data: listBucketsData, loading: isFetchingListBuckets } =
    useListBuckets();
  const { data: navigateBucketData, loading: isFetchingNavigateBucket } =
    useNavigateBucket(bucket ?? '', key);

  const onSelect = (bucket: string | string[]): void => {
    if (Array.isArray(bucket)) {
      return;
    }

    console.log(bucket);

    setPaths([defaultParams.Prefix]);
    setBucket(bucket);
  };

  const onNavigateBack = (): void => {
    if (isFetchingNavigateBucket) return;

    if (paths.length > 1) {
      setPaths(getPreviousPaths(paths));
    } else {
      setToast({ type: 'warning', text: 'Cannot go back' });
    }
  };

  const buckets = defaultTo(listBucketsData?.buckets, []);
  const defaultSelectValue = defaultTo(bucket, undefined);
  const objects = defaultTo(navigateBucketData?.objects, []);

  function onNext(path: string) {
    const updatedPaths = getUpdatedPath(paths, path);
    setPaths(updatedPaths);
  }

  return (
    <div className='p-8 w-full flex flex-col'>
      <Title
        defaultValue={defaultSelectValue}
        loading={isFetchingListBuckets}
        buckets={buckets}
        onSelect={onSelect}
      />
      <ObjectList
        bucket={bucket}
        objects={objects}
        paths={paths}
        loading={isFetchingNavigateBucket}
        onNext={onNext}
        onBack={onNavigateBack}
      />
    </div>
  );
}

interface ObjectListProps {
  bucket: string | null;
  objects: S3Object[];
  paths: string[];
  loading: boolean;
  onNext: (path: string) => void;
  onBack: () => void;
}

function ObjectList(props: ObjectListProps): React.ReactElement {
  const { bucket, objects, paths, loading, onNext, onBack } = props;

  function renderObject(object: S3Object): React.ReactNode {
    const { key } = object;
    return <ObjectListItem key={key} object={object} onNext={onNext} />;
  }

  const hasItems = !!objects.length && !!bucket && !loading;
  const isEmpty = !objects.length && bucket && !loading;

  return (
    <div
      className='flex flex-col mt-4 rounded-md p-4 border'
      style={{ height: '80vh' }}
    >
      <div className='pb-2 flex items-center justify-between'>
        {bucket ? (
          <div className='flex items-center'>
            <ChevronLeft
              className='cursor-pointer'
              size={22}
              onClick={onBack}
            />
            <Breadcrumbs>
              <Breadcrumbs.Item>
                <Database size={20} />
                {bucket}
              </Breadcrumbs.Item>
              {React.Children.toArray(
                paths.map(path => (
                  <Breadcrumbs.Item className='text-sm font-light' key={path}>
                    {path}
                  </Breadcrumbs.Item>
                )),
              )}
            </Breadcrumbs>
          </div>
        ) : (
          <div className='flex items-center'>
            <Info size={18} />
            <Spacer w={0.5} />
            <span className='text-sm font-light'>Select a bucket</span>
          </div>
        )}
        <Input icon={<Search />} placeholder='Search...' />
      </div>

      {loading && (
        <Empty
          icon={
            <Oval
              height={30}
              width={30}
              color={Colors.primary}
              secondaryColor={Colors.secondary}
            />
          }
        />
      )}

      {!bucket && (
        <Empty
          text='Please select a bucket'
          icon={<AlertCircle color='#CCC' size={50} />}
        />
      )}

      {isEmpty && (
        <Empty
          text='No objects found...'
          icon={<Archive color='#CCC' size={50} />}
        />
      )}

      {hasItems && (
        <div className='flex flex-1 flex-col overflow-scroll'>
          {React.Children.toArray(objects.map(renderObject))}
        </div>
      )}
    </div>
  );
}

interface EmptyProps {
  text?: string;
  icon?: React.ReactNode;
}

function Empty(props: EmptyProps): React.ReactElement {
  const { text, icon } = props;

  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      {icon}
      <Spacer h={1} />
      <span className='italic text-light text-gray-400'>{text}</span>
    </div>
  );
}

interface ObjectListItemProps {
  object: S3Object;
  onNext: (path: string) => void;
}

function ObjectListItem(props: ObjectListItemProps): React.ReactElement {
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

interface TitleProps {
  defaultValue: string | undefined;
  loading: boolean;
  buckets: Bucket[];
  onSelect?: (value: string | string[]) => void;
}

function Title(props: TitleProps) {
  const { defaultValue, loading, buckets, onSelect } = props;

  return (
    <Description
      title={<Text h6>{config.name}</Text>}
      content={
        <Select
          value={defaultValue}
          placeholder='select a source'
          onChange={onSelect}
        >
          {React.Children.toArray(
            buckets.map((bucket: Bucket) => (
              <Select.Option key={bucket.name} value={bucket.name}>
                {bucket.name}
              </Select.Option>
            )),
          )}
        </Select>
      }
    />
  );
}
