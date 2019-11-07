import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './NoteSidebar.module.scss';

interface NoteSidebarProps {
  loadDocsAction?: Function;
}

function NoteSidebar(props: NoteSidebarProps) {
  const { loadDocsAction } = props;
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

  return (
    <div className={styles.sidebar}>
      {_.isEmpty(docs) ? (
        <React.Fragment>No notes yet.</React.Fragment>
      ) : (
        _.map(docs, ({ id, header }) => (
          <Link to={`/notes/${id}`} key={id}>
            {header}
          </Link>
        ))
      )}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(NoteSidebar);
