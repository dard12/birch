import React from 'react';
import styles from './SearchFilter.module.scss';

interface SearchFilterProps {
  header: string;
  description: string;
  children?: any;
}

export function SearchFilter(props: SearchFilterProps) {
  const { header, description, children } = props;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>{header}</div>
      <div className={styles.filterDescription}>{description}</div>
      <div className={styles.filterControl}>{children}</div>
    </div>
  );
}
