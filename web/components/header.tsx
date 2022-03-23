import { Description, Loading, Select, Spacer, Text } from '@geist-ui/core';
import defaultTo from 'lodash/defaultTo';
import React from 'react';
import { Bucket } from '../api';
import config from '../config';
import { useListBuckets } from '../hooks/buckets';

interface TitleProps {
  value: string | null;
  onSelect?: (value: string | string[]) => void;
}

export default function Header(props: TitleProps): React.ReactElement {
  const { value, onSelect } = props;

  const { data, loading } = useListBuckets();

  const defaultValue = defaultTo(value, undefined);
  const buckets = defaultTo(data?.buckets, []);

  const title: React.ReactNode = <Text h6>{config.name}</Text>;

  function renderBucket({ name }: Bucket): React.ReactNode {
    return (
      <Select.Option key={name} value={name}>
        {name}
      </Select.Option>
    );
  }

  const placeholder: React.ReactNode = (
    <div className='flex items-center'>
      <span>select a bucket</span>
      <Spacer w={0.5} />
      {loading && <Loading width={2} />}
    </div>
  );

  const content: React.ReactNode = (
    <Select value={defaultValue} placeholder={placeholder} onChange={onSelect}>
      {React.Children.toArray(buckets.map(renderBucket))}
    </Select>
  );

  return <Description title={title} content={content} />;
}
