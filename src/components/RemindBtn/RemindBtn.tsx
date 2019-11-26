import React from 'react';
import { IoIosRefresh, IoIosArrowDown } from 'react-icons/io';
import styles from './RemindBtn.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../Modal/Modal';

interface RemindBtnProps {}

function RemindBtn(props: RemindBtnProps) {
  return (
    <div className={styles.remindContainer}>
      <Modal
        buttonChildren={
          <Button className={styles.shuffleBtn}>
            <IoIosRefresh />
            Remind Me
          </Button>
        }
        render={() => null}
      />

      <Button className={styles.settingBtn}>
        <IoIosArrowDown />
      </Button>
    </div>
  );
}

export default RemindBtn;
