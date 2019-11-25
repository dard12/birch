import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IoIosAdd } from 'react-icons/io';
import styles from './ReminderList.module.scss';
import { useAxiosGet, axiosPost, useLoadDocs } from '../../hooks/useAxios';
import { ReminderItemDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';
import ReminderItem from '../ReminderItem/ReminderItem';
import ReminderName from '../ReminderName/ReminderName';
import { createDocListSelector } from '../../redux/selectors';

interface ReminderListProps {
  reminder: string;
  reminderItemDocs?: ReminderItemDoc[];
  loadDocsAction?: Function;
}

function ReminderList(props: ReminderListProps) {
  const { reminder, reminderItemDocs, loadDocsAction } = props;
  const params = { reminder_id: reminder };
  const { result, setParams } = useAxiosGet('/api/reminder_item', params, {
    name: 'ReminderList',
    reloadOnChange: true,
  });

  useLoadDocs({ collection: 'reminder_item', result, loadDocsAction });

  useFocus(() => setParams(params));

  const newPageOnClick = () => {
    const maxReminder = _.maxBy(reminderItemDocs, 'position');
    const maxPosition = _.get(maxReminder, 'position') || 0;
    const position = maxPosition + 1;

    axiosPost(
      '/api/reminder_item',
      { position, reminder_id: reminder },
      { collection: 'reminder_item', loadDocsAction },
    );
  };

  return (
    <div className={styles.note}>
      <ReminderName reminder={reminder} />

      {_.map(reminderItemDocs, ({ id }) => (
        <ReminderItem reminder_item={id} key={id} />
      ))}

      <div className={styles.newItem} onClick={newPageOnClick}>
        New Item
        <IoIosAdd />
      </div>
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'reminder_item',
    filter: 'none',
    prop: 'reminderItemDocs',
    orderBy: ['position'],
  }),
  { loadDocsAction },
)(ReminderList);
