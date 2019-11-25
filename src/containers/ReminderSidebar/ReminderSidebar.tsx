import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { useAxiosGet, useLoadDocs, axiosPost } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from '../NoteSidebar/NoteSidebar.module.scss';
import { createDocListSelector } from '../../redux/selectors';
import { ReminderDoc } from '../../../src-server/models';
import history from '../../history';
import RemindBtn from '../../components/RemindBtn/RemindBtn';

interface ReminderSidebarProps {
  reminder?: string;
  reminderDocs?: ReminderDoc[];
  loadDocsAction?: Function;
}

function ReminderSidebar(props: ReminderSidebarProps) {
  const { reminder, reminderDocs, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/reminder',
    {},
    { name: 'ReminderSidebar' },
  );

  useLoadDocs({ collection: 'reminder', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const firstReminder = _.get(reminderDocs, '[0].id');

  if (!reminder && firstReminder) {
    return <Redirect to={`/reminders/${firstReminder}`} />;
  }

  const newPageOnClick = () => {
    const maxReminder = _.maxBy(reminderDocs, 'position');
    const maxPosition = _.get(maxReminder, 'position') || 0;
    const position = maxPosition + 1;

    axiosPost(
      '/api/reminder',
      { position },
      { collection: 'reminder', loadDocsAction },
    ).then(({ docs }) => {
      const reminderId = _.get(docs, '[0].id');
      reminderId && history.push(`/reminders/${reminderId}`);
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarButtons}>
        <RemindBtn />
      </div>

      {_.isEmpty(reminderDocs) ? (
        <div className={styles.sidebarFaded}>No pages yet.</div>
      ) : (
        _.map(reminderDocs, ({ id, header }) => (
          <div key={id} className={styles.sidetab}>
            <NavLink to={`/reminders/${id}`} activeClassName={styles.active}>
              {header || 'Untitled'}
            </NavLink>

            <IoIosClose className={styles.tabMore} />
          </div>
        ))
      )}

      <div className={styles.newPage} onClick={newPageOnClick}>
        New Page
        <IoIosAdd />
      </div>
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'reminder',
    filter: 'none',
    prop: 'reminderDocs',
    orderBy: ['position'],
  }),
  { loadDocsAction },
)(ReminderSidebar);
