import React from 'react';
import { IoIosRefresh } from 'react-icons/io';
import _ from 'lodash';
import styles from './RemindButton.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useAxiosGet } from '../../hooks/useAxios';
import RichText from '../../components/RichText/RichText';

interface RemindButtonProps {}

function RemindButton(props: RemindButtonProps) {
  const params = { sort: 'last_seen' };
  const { result, setParams } = useAxiosGet('/api/reminder_item', params, {
    name: 'RemindButton',
    reloadOnChange: true,
  });
  const content = _.get(result, 'docs[0].content');
  const header = _.get(result, 'docs[0].header');
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
            <div className={styles.remindHeader}>{header}</div>
            <RichText
              content={content}
              className={styles.remindContent}
              readOnly
            />
          </div>
        )}
      />
    </div>
  );
}

export default RemindButton;
