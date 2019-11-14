import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { IoIosAdd } from 'react-icons/io';
import { useAxiosGet, useLoadDocs, axiosPost } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './NoteSidebar.module.scss';
import { Button } from '../../components/Button/Button';
import { createDocListSelector } from '../../redux/selectors';
import { NoteDoc } from '../../../src-server/models';

interface NoteSidebarProps {
  note?: string;
  noteDocs?: NoteDoc[];
  loadDocsAction?: Function;
}

function NoteSidebar(props: NoteSidebarProps) {
  const { note, noteDocs, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/note',
    {},
    { name: 'NoteSidebar' },
  );

  useLoadDocs({ collection: 'note', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const firstNote = _.get(noteDocs, '[0].id');

  if (!note && firstNote) {
    return <Redirect to={`/notes/${firstNote}`} />;
  }

  const newPageOnClick = () => {
    axiosPost('/api/note', {}, { collection: 'note', loadDocsAction });
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <Button className={styles.addBtn} onClick={newPageOnClick}>
          <IoIosAdd />
          New Page
        </Button>
      </div>

      {_.isEmpty(noteDocs) ? (
        <div className="faded">No notes yet.</div>
      ) : (
        _.map(noteDocs, ({ id, header }) => (
          <NavLink to={`/notes/${id}`} key={id} activeClassName={styles.active}>
            {header || 'Untitled'}
          </NavLink>
        ))
      )}
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'note',
    filter: 'none',
    prop: 'noteDocs',
    orderBy: ['position'],
  }),
  { loadDocsAction },
)(NoteSidebar);
