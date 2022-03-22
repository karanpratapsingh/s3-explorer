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

  return (
    <Description
      title={<Text h6>{config.name}</Text>}
      content={
        <Select
          value={defaultValue}
          placeholder={
            <div className='flex items-center'>
              <span>select a bucket</span>
              <Spacer w={0.5} />
              {loading && <Loading width={2} />}
            </div>
          }
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
