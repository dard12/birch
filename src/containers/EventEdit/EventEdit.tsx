import React from 'react';
import styles from './EventEdit.module.scss';
import Modal from '../../components/Modal/Modal';

interface EventEditProps {}

function EventEdit(props: EventEditProps) {
  return (
    <Modal
      buttonRender={(openModal: any) => (
        <div className={styles.editEvents} onClick={openModal}>
          Edit
        </div>
      )}
      modalRender={closeModal => <div className={styles.eventModal}>hello</div>}
    />
  );
}

export default EventEdit;
