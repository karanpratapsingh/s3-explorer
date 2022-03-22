import { Description, Select, Text } from '@geist-ui/core';
import React from 'react';
import { Bucket } from '../api';
import config from '../config';

interface TitleProps {
  defaultValue: string | undefined;
  loading: boolean;
  buckets: Bucket[];
  onSelect?: (value: string | string[]) => void;
}

// TODO: use loading
export default function Header(props: TitleProps): React.ReactElement {
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
