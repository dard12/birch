import React from 'react';
import { IoIosCalendar } from 'react-icons/io';
import styles from './EventButton.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

interface EventButtonProps {}

function EventButton(props: EventButtonProps) {
  return (
    <div className={styles.eventContainer}>
      <Modal
        buttonRender={openModal => (
          <Button className={styles.eventBtn} onClick={openModal}>
            <IoIosCalendar />
            Create Event
          </Button>
        )}
        modalRender={closeModal => (
          <div className={styles.eventModal}>hello</div>
        )}
      />
    </div>
  );
}

export default EventButton;
