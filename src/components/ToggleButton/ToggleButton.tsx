import React from 'react';
import classNames from 'classnames';
import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  onChange?: any;
  checked: boolean;
  children: any;
}

export default function ToggleButton(props: ToggleButtonProps) {
  const { onChange, checked, children, ...passedProps } = props;

  return (
    <label
      className={classNames(styles.toggleButton, { [styles.active]: checked })}
      {...passedProps}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />
      {children}
    </label>
  );
}
