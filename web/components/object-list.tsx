import { Breadcrumbs, Input, Loading, Spacer, useModal } from '@geist-ui/core';
import AlertCircle from '@geist-ui/icons/alertCircle';
import Archive from '@geist-ui/icons/archive';
import ChevronLeft from '@geist-ui/icons/chevronLeft';
import Database from '@geist-ui/icons/database';
import Info from '@geist-ui/icons/info';
import Search from '@geist-ui/icons/search';
import defaultTo from 'lodash/defaultTo';
import React, { useMemo, useState } from 'react';
import { NavigateResponse, S3Object } from '../api';
import { useNavigateBucket } from '../hooks/buckets';
import { useNotifyError } from '../hooks/options';
import { defaultParams } from '../utils/aws';
import { createBreadcrumbs, filterObjects } from '../utils/shared';
import { Colors } from '../utils/theme';
import Empty from './empty';
import ObjectListItem, { ActionType } from './object-listitem';
import ShareModal from './share-modal';

interface ObjectListProps {
  bucket: string | null;
  currentKey: string;
  onNext: (key: string) => void;
  onBack: () => void;
}

export default function ObjectList(props: ObjectListProps): React.ReactElement {
  const { bucket, currentKey, onNext, onBack } = props;

  const { setVisible, bindings } = useModal();

  const [search, setSearch] = useState('');
  const [objectKey, setObjectKey] = useState(defaultParams.Prefix);

  const { data, loading, error } = useNavigateBucket(
    defaultTo(bucket, ''),
    currentKey,
  );

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

  function renderObject(object: S3Object): React.ReactNode {
    const { key } = object;

    return (
      <ObjectListItem
        key={key}
        object={object}
        onNext={onNext}
        onAction={onAction}
      />
    );
  }

  const filteredObjects = useMemo(
    () => filterObjects(search, objects),
    [search, objects],
  );

  const hasItems = !!filteredObjects.length && !!bucket && !loading;
  const isEmpty = !filteredObjects.length && bucket && !loading;
  const isRoot = currentKey !== defaultParams.Prefix;

  const onNavigateBack = () => !loading && onBack();

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
      <Info color={Colors.secondary} size={18} />
      <Spacer w={0.5} />
      <span className='text-sm font-light text-secondary'>Select a bucket</span>
    </div>
  );

  if (bucket) {
    breadcrumbContent = (
      <div className='flex items-center'>
        {isRoot && (
          <ChevronLeft
            className='cursor-pointer'
            size={25}
            onClick={onNavigateBack}
          />
        )}
        <Breadcrumbs>
          <Breadcrumbs.Item style={{ fontWeight: 300, fontSize: 30 }}>
            <Database className='db-icon' />
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
        <Input icon={<Search />} placeholder='Search...' onChange={onSearch} />
      </div>

      {loading && <Empty icon={<Loading scale={2} />} />}

      {!bucket && (
        <Empty text='Please select a bucket' icon={<AlertCircle size={50} />} />
      )}

      {isEmpty && (
        <Empty text='No objects found' icon={<Archive size={50} />} />
      )}

      {hasItems && (
        <div className='flex flex-1 pt-3 flex-col overflow-scroll'>
          {React.Children.toArray(filteredObjects.map(renderObject))}
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
