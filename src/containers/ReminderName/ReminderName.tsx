import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './ReminderName.module.scss';
import { useAxiosGet, axiosPost } from '../../hooks/useAxios';
import { ReminderDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';

interface ReminderNameProps {
  reminder: string;
  loadDocsAction?: Function;
}

function ReminderName(props: ReminderNameProps) {
  const { reminder, loadDocsAction } = props;
  const params = { id: reminder };
  const { result, isSuccess, setParams } = useAxiosGet(
    '/api/reminder',
    params,
    { name: 'ReminderList', reloadOnChange: true },
  );
  const [header, setHeader] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const reminderDoc: ReminderDoc = _.get(result, 'docs[0]');

  useFocus(() => setParams(params));

  if (!reminderDoc || !isSuccess) {
    isLoaded && setIsLoaded(false);
    return <div className={styles.heading} />;
  }

  const { id, header: savedHeader } = reminderDoc;

  if (!isLoaded) {
    setHeader(savedHeader);
    setIsLoaded(true);
  }

  const postHeader = _.debounce(header => {
    axiosPost(
      '/api/reminder',
      { id, header },
      { collection: 'reminder', loadDocsAction },
    );
  }, 500);

  const headerOnChange = (event: any) => {
    const header = event.currentTarget.value;
    setHeader(header);
    postHeader(header);
  };

  return (
    <TextareaAutosize
      className={styles.heading}
      value={header || ''}
      placeholder="Untitled"
      onChange={headerOnChange}
    />
  );
}

export default connect(
  null,
  { loadDocsAction },
)(ReminderName);
