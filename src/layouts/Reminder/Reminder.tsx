import React from 'react';
import styles from './Reminder.module.scss';

interface ReminderProps {}

function Reminder(props: ReminderProps) {
  return <div className={styles.homePage}>reminders</div>;
}

export default Reminder;
