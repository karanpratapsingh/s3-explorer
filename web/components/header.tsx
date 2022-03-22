import { Description, Select, Spacer, Text } from '@geist-ui/core';
import React from 'react';
import { Bucket } from '../api';
import config from '../config';
import Loader from './loader';

interface TitleProps {
  defaultValue: string | undefined;
  loading: boolean;
  buckets: Bucket[];
  onSelect?: (value: string | string[]) => void;
}

export default function Header(props: TitleProps): React.ReactElement {
  const { defaultValue, loading, buckets, onSelect } = props;

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
              {loading && <Loader size={15} />}
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
