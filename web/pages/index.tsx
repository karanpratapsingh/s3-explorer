import { useToasts } from '@geist-ui/core';
import React, { useState } from 'react';
import Header from '../components/header';
import ObjectList from '../components/object-list';
import { defaultParams } from '../utils/aws';
import { getPreviousKey } from '../utils/shared';

export default function Home(): React.ReactElement {
  const { setToast } = useToasts();

  const [bucket, setBucket] = useState(defaultParams.Bucket);
  const [currentKey, setCurrentKey] = useState(defaultParams.Prefix);

  function onSelect(bucket: string | string[]): void {
    if (Array.isArray(bucket)) {
      return;
    }

    setBucket(bucket);
    setCurrentKey(defaultParams.Prefix);
  }

  function onNext(key: string): void {
    setCurrentKey(key);
  }

  function onBack(): void {
    if (currentKey.length) {
      const prevKey = getPreviousKey(currentKey);
      setCurrentKey(prevKey);
    } else {
      setToast({
        type: 'warning',
        text: 'Already at the root. Please select a different bucket.',
      });
    }
  }

  return (
    <div className='p-8 w-full flex flex-col fade-in'>
      <Header value={bucket} onSelect={onSelect} />
      <ObjectList
        bucket={bucket}
        currentKey={currentKey}
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
}
