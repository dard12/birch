import React from 'react';
import styles from './Reminder.module.scss';
import ReminderSidebar from '../../containers/ReminderSidebar/ReminderSidebar';

interface ReminderProps {
  reminder?: string;
}

function Reminder(props: ReminderProps) {
  const { reminder } = props;

  return (
    <div className={styles.reminderPage}>
      <ReminderSidebar reminder={reminder} />
      {/* {note && <Note note={note} />} */}
    </div>
  );
}

export default Reminder;
