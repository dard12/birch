import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './Dialog.module.scss';
import { Button } from '../Button/Button';

interface DialogProps {
  buttonText: string;
  text: string;
  onConfirm: Function;
}

export default function Dialog(props: DialogProps) {
  const { buttonText, text, onConfirm } = props;
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <React.Fragment>
      <Button className="btn" onClick={openModal}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.content}>{text}</div>
        <div className={styles.actions}>
          <Button className="btn" color="grey" onClick={closeModal}>
            Cancel
          </Button>
          <Button className="btn" onClick={onConfirm}>
            OK
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
}
