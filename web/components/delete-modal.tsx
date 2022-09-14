import { Modal, useToasts } from '@geist-ui/core';
import { ModalHooksBindings } from '@geist-ui/core/esm/use-modal';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { DeleteRequest, DeleteResponse } from '../api';
import { useDeleteObject } from '../hooks/objects';
import { useNotifyError } from '../hooks/options';

interface DeleteModalProps {
  bucket: string;
  objectKey: string;
  bindings: ModalHooksBindings;
  onClose: VoidFunction;
}

export default function DeleteModal(
  props: DeleteModalProps,
): React.ReactElement {
  const { bucket, objectKey, bindings, onClose } = props;

  const { setToast } = useToasts();
  const { mutate, data, loading, error } = useDeleteObject(objectKey);

  useNotifyError<DeleteResponse>({ data, loading, error });

  function deleteObject(): void {
    if (isEmpty(objectKey)) {
      setToast({ type: 'error', text: 'object key is empty' });
      return;
    }

    if (isEmpty(bucket)) {
      setToast({ type: 'error', text: 'bucket is null' });
      return;
    }

    const params: DeleteRequest = {
      bucket,
      key: objectKey,
    };

    mutate(params, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Modal {...bindings} width='28rem'>
      <Modal.Title>Delete</Modal.Title>
      <Modal.Content>
        <p className='text-sm font-light'>
          Are you sure you want to delete <code>{objectKey}</code>?
        </p>
      </Modal.Content>
      <Modal.Action passive onClick={onClose}>
        Cancel
      </Modal.Action>
      <Modal.Action type='error' loading={loading} onClick={deleteObject}>
        Delete
      </Modal.Action>
    </Modal>
  );
}
