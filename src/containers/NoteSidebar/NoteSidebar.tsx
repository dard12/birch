import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { useAxiosGet, useLoadDocs, axiosPost } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './NoteSidebar.module.scss';
import { createDocListSelector } from '../../redux/selectors';
import { NoteDoc } from '../../../src-server/models';
import history from '../../history';
import RemindBtn from '../../components/RemindBtn/RemindBtn';

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
    const maxNote = _.maxBy(noteDocs, 'position');
    const maxPosition = _.get(maxNote, 'position') || 0;
    const position = maxPosition + 1;

    axiosPost(
      '/api/note',
      { position },
      { collection: 'note', loadDocsAction },
    ).then(({ docs }) => {
      const noteId = _.get(docs, '[0].id');
      noteId && history.push(`/notes/${noteId}`);
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarButtons}>
        <RemindBtn />
      </div>

      {_.isEmpty(noteDocs) ? (
        <div className="faded">No pages yet.</div>
      ) : (
        <React.Fragment>
          {_.map(noteDocs, ({ id, header }) => (
            <div key={id} className={styles.sidetab}>
              <NavLink to={`/notes/${id}`} activeClassName={styles.active}>
                {header || 'Untitled'}
              </NavLink>

              <IoIosClose className={styles.tabMore} />
            </div>
          ))}

          <div className={styles.newPage} onClick={newPageOnClick}>
            New Page
            <IoIosAdd />
          </div>
        </React.Fragment>
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
