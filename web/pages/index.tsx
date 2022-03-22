import { useToasts } from '@geist-ui/core';
import defaultTo from 'lodash/defaultTo';
import React, { useState } from 'react';
import Header from '../components/header';
import ObjectList from '../components/object-list';
import { useListBuckets, useNavigateBucket } from '../hooks/buckets';
import { defaultParams } from '../utils/aws';
import { getPreviousKey } from '../utils/shared';

export default function Home(): React.ReactElement {
  const { setToast } = useToasts();
  const [bucket, setBucket] = useState(defaultParams.Bucket);
  const [key, setKey] = useState(defaultParams.Prefix);

  const { data: listBucketsData, loading: loadingBuckets } = useListBuckets();
  const { data: navigateBucketData, loading: loadingNavigateBucket } =
    useNavigateBucket(bucket, key);

  const onSelect = (bucket: string | string[]): void => {
    if (Array.isArray(bucket)) {
      return;
    }

    setBucket(bucket);
  };

  const buckets = defaultTo(listBucketsData?.buckets, []);
  const defaultSelectValue = defaultTo(bucket, undefined);
  const objects = defaultTo(navigateBucketData?.objects, []);

  function onNext(key: string): void {
    setKey(key);
  }

  function onBack(): void {
    if (loadingNavigateBucket) return;

    if (key.length) {
      const prevKey = getPreviousKey(key);
      setKey(prevKey);
    } else {
      setToast({ type: 'warning', text: 'Cannot go back' });
    }
  }

  return (
    <div className='p-8 w-full flex flex-col'>
      <Header
        value={defaultSelectValue}
        loading={loadingBuckets}
        buckets={buckets}
        onSelect={onSelect}
      />
      <ObjectList
        bucket={bucket}
        objects={objects}
        currentKey={key}
        loading={loadingNavigateBucket}
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
}
