import React from 'react';
import { IoIosCalendar } from 'react-icons/io';
import styles from './EventCreate.module.scss';
import { Button } from '../../components/Button/Button';

interface EventButtonProps {
  loadDocsAction?: Function;
}

function EventButton(props: EventButtonProps) {
  return (
    <a
      href="https://calendar.google.com/calendar/r"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button className={styles.eventBtn}>
        <IoIosCalendar />
        See Calendar
      </Button>
    </a>
  );
}

export default EventButton;
