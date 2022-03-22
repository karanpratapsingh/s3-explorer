import { useToasts } from '@geist-ui/core';
import defaultTo from 'lodash/defaultTo';
import React, { useMemo, useState } from 'react';
import Header from '../components/header';
import ObjectList from '../components/object-list';
import { useListBuckets, useNavigateBucket } from '../hooks/buckets';
import { defaultParams } from '../utils/aws';
import {
  getKeyFromPath,
  getPreviousPaths,
  getUpdatedPath,
} from '../utils/shared';

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
      <Header
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
