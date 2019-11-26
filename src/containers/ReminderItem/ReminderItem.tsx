import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './ReminderItem.module.scss';
import { useAxiosGet, useLoadDocs, axiosPost } from '../../hooks/useAxios';
import { ReminderItemDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';
import RichText from '../../components/RichText/RichText';
import { createDocSelector } from '../../redux/selectors';

interface ReminderItemProps {
  reminder_item: string;
  reminderItemDoc?: ReminderItemDoc;
  loadDocsAction?: Function;
}

function ReminderItem(props: ReminderItemProps) {
  const { reminder_item, reminderItemDoc, loadDocsAction } = props;
  const params = { id: reminder_item };
  const { result, isSuccess, setParams } = useAxiosGet(
    '/api/reminder_item',
    params,
    {
      name: 'ReminderItem',
      reloadOnChange: true,
      cachedResult: reminderItemDoc,
    },
  );

  useFocus(() => setParams(params));

  useLoadDocs({ collection: 'reminder_item', result, loadDocsAction });

  if (!reminderItemDoc || !isSuccess) {
    return null;
  }

  const { id, content } = reminderItemDoc;

  const postContent = _.debounce(newContent => {
    axiosPost(
      '/api/reminder_item',
      { id, content: newContent },
      { collection: 'reminder_item', loadDocsAction },
    );
  }, 500);

  return (
    <div className={styles.item}>
      <RichText content={content} onChange={postContent} />
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'reminder_item',
    id: 'reminder_item',
    prop: 'reminderItemDoc',
  }),
  { loadDocsAction },
)(ReminderItem);
