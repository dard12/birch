import React from 'react';
import Flatpickr from 'react-flatpickr';
import styles from './DatePicker.module.scss';
import 'flatpickr/dist/themes/light.css';

interface DatePickerProps {}

export function DatePicker(props: DatePickerProps & any) {
  const { className = styles.datetime, ...passedProps } = props;

  return (
    <Flatpickr
      className={className}
      options={{ dateFormat: 'M j, Y' }}
      {...passedProps}
    />
  );
}
