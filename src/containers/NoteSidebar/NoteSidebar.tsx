import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './NoteSidebar.module.scss';

interface NoteSidebarProps {
  note?: string;
  loadDocsAction?: Function;
}

function NoteSidebar(props: NoteSidebarProps) {
  const { note, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/note',
    {},
    { name: 'NoteList' },
  );

  useLoadDocs({ collection: 'note', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const { docs } = result;
  const firstNote = _.get(docs, '[0].id');

  if (!note && firstNote) {
    return <Redirect to={`/notes/${firstNote}`} />;
  }

  return (
    <div className={styles.sidebar}>
      {_.isEmpty(docs) ? (
        <React.Fragment>No notes yet.</React.Fragment>
      ) : (
        _.map(docs, ({ id, header }) => (
          <NavLink to={`/notes/${id}`} key={id} activeClassName={styles.active}>
            {header}
          </NavLink>
        ))
      )}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(NoteSidebar);
