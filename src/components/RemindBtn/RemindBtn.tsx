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
        buttonRender={openModal => (
          <Button className={styles.shuffleBtn} onClick={openModal}>
            <IoIosRefresh />
            Remind Me
          </Button>
        )}
        modalRender={closeModal => (
          <div className={styles.remindModal}>
            <div className={styles.remindHeader}>To Do</div>
            <div className={styles.remindContent}>
              Figure out what to do in Taipei, Taiwan, Japan.
            </div>
          </div>
        )}
      />

      <Button className={styles.settingBtn}>
        <IoIosArrowDown />
      </Button>
    </div>
  );
}

export default RemindBtn;
