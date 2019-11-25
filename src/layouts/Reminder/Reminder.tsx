import React from 'react';
import styles from './Reminder.module.scss';
import ReminderSidebar from '../../containers/ReminderSidebar/ReminderSidebar';
import ReminderList from '../../containers/ReminderList/ReminderList';

interface ReminderProps {
  reminder?: string;
}

function Reminder(props: ReminderProps) {
  const { reminder } = props;

  return (
    <div className={styles.reminderPage}>
      <ReminderSidebar reminder={reminder} />
      {reminder && <ReminderList reminder={reminder} />}
    </div>
  );
}

export default Reminder;
