import React, { useState } from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';

interface ModalProps {
  buttonRender: (openModal: Function) => any;
  modalRender: (closeModal: Function) => any;
  onClose?: Function;
}

ReactModal.setAppElement('#root');

export default function Modal(props: ModalProps) {
  const { buttonRender, modalRender, onClose } = props;
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    onClose && onClose();
    setIsOpen(false);
  };
  const openModal = () => setIsOpen(true);

  const body = document.querySelector('body');

  if (body) {
    isOpen
      ? body.classList.add(styles.modalOpen)
      : body.classList.remove(styles.modalOpen);
  }

  return (
    <React.Fragment>
      {buttonRender(openModal)}

      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        {isOpen && modalRender(closeModal)}
      </ReactModal>
    </React.Fragment>
  );
}
