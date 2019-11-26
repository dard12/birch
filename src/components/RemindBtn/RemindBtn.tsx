import React from 'react';
import { IoIosRefresh, IoIosArrowDown } from 'react-icons/io';
import _ from 'lodash';
import styles from './RemindBtn.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../Modal/Modal';
import { useAxiosGet } from '../../hooks/useAxios';

interface RemindBtnProps {}

function RemindBtn(props: RemindBtnProps) {
  const params = { sort: 'random' };
  const { result, setParams } = useAxiosGet('/api/reminder_item', params, {
    name: 'RemindBtn',
    reloadOnChange: true,
  });
  const content = _.get(result, 'docs[0].content');
  const refreshReminder = () => setParams(params);

  return (
    <div className={styles.remindContainer}>
      <Modal
        onClose={refreshReminder}
        buttonRender={openModal => (
          <Button className={styles.shuffleBtn} onClick={openModal}>
            <IoIosRefresh />
            Remind Me
          </Button>
        )}
        modalRender={closeModal => (
          <div className={styles.remindModal}>
            <div className={styles.remindHeader}>To Do</div>
            <div className={styles.remindContent}>{content}</div>
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
