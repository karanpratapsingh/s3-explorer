import {
  Button,
  Grid,
  Input,
  Modal,
  Select,
  Snippet,
  useToasts
} from '@geist-ui/core';
import { ModalHooksBindings } from '@geist-ui/core/esm/use-modal';
import ClockIcon from '@geist-ui/icons/clock';
import isEmpty from 'lodash/isEmpty';
import React, { ChangeEvent, useState } from 'react';
import { PresignRequest, PresignResponse, PresignTimeUnit } from '../api';
import { usePresignUrl } from '../hooks/objects';
import { useNotifyError } from '../hooks/options';

interface ShareModalProps {
  bucket: string;
  objectKey: string;
  bindings: ModalHooksBindings;
  onClose: VoidFunction;
}

export default function ShareModal(props: ShareModalProps): React.ReactElement {
  const { bucket, objectKey, bindings, onClose } = props;

  const { setToast } = useToasts();
  const { mutate, data, loading, error } = usePresignUrl(objectKey);

  const [time, setTime] = useState('5');
  const [unit, setUnit] = useState(PresignTimeUnit.Hour);

  const type = Number.parseInt(time) < 0 ? 'error' : 'default';

  useNotifyError<PresignResponse>({ data, loading, error });

  function generatePresignUrl(): void {
    if (isEmpty(objectKey)) {
      setToast({ type: 'error', text: 'object key is empty' });
      return;
    }

    if (isEmpty(bucket)) {
      setToast({ type: 'error', text: 'bucket is null' });
      return;
    }

    const params: PresignRequest = {
      bucket,
      key: objectKey,
      duration: `${time}${unit}`,
    };

    mutate(params);
  }

  function onTime({ target }: ChangeEvent<HTMLInputElement>): void {
    setTime(target.value);
  }

  function renderTimeUnitOption([key, value]: [
    string,
    string,
  ]): React.ReactNode {
    return (
      <Select.Option key={key} value={value}>
        {key}
      </Select.Option>
    );
  }

  function onUnit(unit: string | string[]): void {
    if (Array.isArray(unit)) {
      return;
    }

    setUnit(unit as PresignTimeUnit);
  }

  const timeUnitOptions = Object.entries(PresignTimeUnit);

  return (
    <Modal {...bindings} width='28rem'>
      <Modal.Title>Share</Modal.Title>
      <Modal.Subtitle>Create a presigned url</Modal.Subtitle>
      <Modal.Content>
        <Grid.Container gap={1} className='flex items-center'>
          <Grid>
            <Input
              value={time}
              type={type}
              htmlType='number'
              placeholder='Duration'
              width='100px'
              onChange={onTime}
            />
          </Grid>
          <Grid>
            <Select
              width={1}
              value={unit}
              placeholder='Unit'
              onChange={onUnit}
              icon={() => <ClockIcon size={20} />}
            >
              {React.Children.toArray(
                timeUnitOptions.map(renderTimeUnitOption),
              )}
            </Select>
          </Grid>
          <Grid>
            <Button auto h={0.9} loading={loading} onClick={generatePresignUrl}>
              Generate
            </Button>
          </Grid>
        </Grid.Container>

        {data?.url && (
          <Snippet className='fade-in' marginTop={1} text={data.url} />
        )}

      </Modal.Content>
      <Modal.Action passive onClick={onClose}>
        Done
      </Modal.Action>
    </Modal>
  );
}
