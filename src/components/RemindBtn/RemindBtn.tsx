import React from 'react';
import { IoIosRefresh, IoIosArrowDown } from 'react-icons/io';
import styles from './RemindBtn.module.scss';
import { Button } from '../../components/Button/Button';

interface RemindBtnProps {}

function RemindBtn(props: RemindBtnProps) {
  return (
    <div className={styles.remindContainer}>
      <Button className={styles.shuffleBtn}>
        <IoIosRefresh />
        Remind Me
      </Button>

      <Button className={styles.settingBtn}>
        <IoIosArrowDown />
      </Button>
    </div>
  );
}

export default RemindBtn;
