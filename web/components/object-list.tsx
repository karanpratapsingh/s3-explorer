import {
  Breadcrumbs,
  Grid,
  Input,
  Loading,
  Spacer,
  useModal,
} from '@geist-ui/core';
import AlertCircleIcon from '@geist-ui/icons/alertCircle';
import ArchiveIcon from '@geist-ui/icons/archive';
import ChevronLeftIcon from '@geist-ui/icons/chevronLeft';
import DatabaseIcon from '@geist-ui/icons/database';
import GridIcon from '@geist-ui/icons/grid';
import InfoIcon from '@geist-ui/icons/info';
import ListIcon from '@geist-ui/icons/list';
import SearchIcon from '@geist-ui/icons/search';
import clsx from 'clsx';
import defaultTo from 'lodash/defaultTo';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import React, { useMemo, useState } from 'react';
import { NavigateResponse, S3Object } from '../api';
import { useNavigateBucket } from '../hooks/buckets';
import { useNotifyError } from '../hooks/options';
import { defaultParams } from '../utils/aws';
import { createBreadcrumbs, filterObjects } from '../utils/shared';
import { Colors } from '../utils/theme';
import Empty from './empty';
import ObjectListItem, { ActionType, LayoutType } from './object-listitem';

const ShareModal = dynamic(() => import('./share-modal'));

interface ObjectListProps {
  bucket: string;
  currentKey: string;
  onNext: (key: string) => void;
  onBack: () => void;
}

export default function ObjectList(props: ObjectListProps): React.ReactElement {
  const { bucket, currentKey, onNext, onBack } = props;

  const { setVisible, bindings } = useModal();

  const [layoutType, setLayoutType] = useState(LayoutType.List);
  const [search, setSearch] = useState('');
  const [objectKey, setObjectKey] = useState(defaultParams.Prefix);

  const { data, loading, error } = useNavigateBucket(bucket, currentKey);

  useNotifyError<NavigateResponse>({ data, loading, error });

  const objects = defaultTo(data?.objects, []);

  function onSearch({ target }: React.ChangeEvent<HTMLInputElement>) {
    setSearch(target.value);
  }

  function onAction(key: string, action: ActionType): void {
    setObjectKey(key);

    switch (action) {
      case ActionType.Share:
        setVisible(true);
        break;
      case ActionType.Delete:
        alert('TODO: implement');
        break;
    }
  }

  function onChangeType(type: LayoutType): void {
    setLayoutType(type);
  }

  function renderObject(object: S3Object): React.ReactNode {
    const { key } = object;

    const isListLayout = layoutType === LayoutType.List;

    return (
      <Grid className={clsx(isListLayout && 'min-w-full')}>
        <ObjectListItem
          key={key}
          layoutType={layoutType}
          object={object}
          onNext={onNavigateNext}
          onAction={onAction}
        />
      </Grid>
    );
  }

  const filteredObjects = useMemo(
    () => filterObjects(search, objects),
    [search, objects],
  );

  const hasItems = !!filteredObjects.length && !isEmpty(bucket) && !loading;
  const noObjects = !filteredObjects.length && !isEmpty(bucket) && !loading;
  const isRoot = currentKey !== defaultParams.Prefix;

  function onNavigateNext(key: string): void {
    setSearch('');
    onNext(key);
  }

  function onNavigateBack(): void {
    if (!loading) {
      setSearch('');
      onBack();
    }
  }

  const breadcrumbs = createBreadcrumbs(currentKey);

  function renderBreadcrumb(breadcrumb: string): React.ReactNode {
    return (
      <Breadcrumbs.Item className='text-sm font-light' key={breadcrumb}>
        {breadcrumb}
      </Breadcrumbs.Item>
    );
  }

  let breadcrumbContent: React.ReactNode = (
    <div className='flex items-center'>
      <InfoIcon color={Colors.secondary} size={18} />
      <Spacer w={0.5} />
      <span className='text-sm font-light text-secondary'>Select a bucket</span>
    </div>
  );

  if (bucket) {
    breadcrumbContent = (
      <div className='flex items-center'>
        {isRoot && (
          <ChevronLeftIcon
            className='cursor-pointer'
            size={25}
            onClick={onNavigateBack}
          />
        )}
        <Breadcrumbs>
          <Breadcrumbs.Item>
            <DatabaseIcon className='db-icon' />
            {bucket}
          </Breadcrumbs.Item>
          {React.Children.toArray(breadcrumbs.map(renderBreadcrumb))}
        </Breadcrumbs>
      </div>
    );
  }

  return (
    <div
      className='flex flex-col mt-4 p-4 rounded-md border border-light'
      style={{ height: '80vh' }}
    >
      <div className='pb-3 flex items-center justify-between border-b border-light'>
        {breadcrumbContent}
        <div className='flex items-center justify-between'>
          <Input
            value={search}
            className='mt-2'
            icon={<SearchIcon />}
            placeholder='Search...'
            onChange={onSearch}
          />
          <div className='ml-2 p-1 cursor-pointer border rounded'>
            {layoutType === LayoutType.List && (
              <GridIcon
                className='fade-in'
                color={Colors.secondary}
                onClick={() => onChangeType(LayoutType.Grid)}
              />
            )}
            {layoutType === LayoutType.Grid && (
              <ListIcon
                className='fade-in'
                color={Colors.secondary}
                onClick={() => onChangeType(LayoutType.List)}
              />
            )}
          </div>
        </div>
      </div>

      {loading && <Empty icon={<Loading scale={2} />} />}

      {!bucket && (
        <Empty
          text='Please select a bucket'
          icon={<AlertCircleIcon size={50} />}
        />
      )}

      {noObjects && (
        <Empty text='No objects found' icon={<ArchiveIcon size={50} />} />
      )}

      {hasItems && (
        <div className='flex flex-1 pt-4 flex-col overflow-y-scroll overflow-x-hidden'>
          <Grid.Container gap={1.5}>
            {React.Children.toArray(filteredObjects.map(renderObject))}
          </Grid.Container>
        </div>
      )}

      <ShareModal
        bucket={bucket}
        objectKey={objectKey}
        bindings={bindings}
        onClose={() => setVisible(false)}
      />
    </div>
  );
}
