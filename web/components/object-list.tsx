import { Breadcrumbs, Input, Spacer } from '@geist-ui/core';
import AlertCircle from '@geist-ui/icons/alertCircle';
import Archive from '@geist-ui/icons/archive';
import ChevronLeft from '@geist-ui/icons/chevronLeft';
import Database from '@geist-ui/icons/database';
import Info from '@geist-ui/icons/info';
import Search from '@geist-ui/icons/search';
import React, { useMemo, useState } from 'react';
import { S3Object } from '../api';
import { filterObjects } from '../utils/shared';
import Empty from './empty';
import Loader from './loader';
import ObjectListItem from './object-listitem';

interface ObjectListProps {
  bucket: string | null;
  objects: S3Object[];
  paths: string[];
  loading: boolean;
  onNext: (path: string) => void;
  onBack: () => void;
}

export default function ObjectList(props: ObjectListProps): React.ReactElement {
  const { bucket, objects, paths, loading, onNext, onBack } = props;

  const [search, setSearch] = useState('');

  function onSearch({ target }: React.ChangeEvent<HTMLInputElement>) {
    setSearch(target.value);
  }

  function renderObject(object: S3Object): React.ReactNode {
    const { key } = object;
    return <ObjectListItem key={key} object={object} onNext={onNext} />;
  }

  const filteredObjects = useMemo(
    () => filterObjects(search, objects),
    [search, objects],
  );

  const hasItems = !!filteredObjects.length && !!bucket && !loading;
  const isEmpty = !filteredObjects.length && bucket && !loading;

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
        <Input icon={<Search />} placeholder='Search...' onChange={onSearch} />
      </div>

      {loading && <Empty icon={<Loader size={30} />} />}

      {!bucket && (
        <Empty text='Please select a bucket' icon={<AlertCircle size={50} />} />
      )}

      {isEmpty && (
        <Empty text='No objects found...' icon={<Archive size={50} />} />
      )}

      {hasItems && (
        <div className='flex flex-1 flex-col overflow-scroll'>
          {React.Children.toArray(filteredObjects.map(renderObject))}
        </div>
      )}
    </div>
  );
}
