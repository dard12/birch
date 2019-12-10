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
import { PersonDoc } from '../../../src-server/models';
import history from '../../history';

interface PersonSidebarProps {
  person?: string;
  personDocs?: PersonDoc[];
  loadDocsAction?: Function;
}

function PersonSidebar(props: PersonSidebarProps) {
  const { person, personDocs, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/person',
    {},
    { name: 'PersonSidebar' },
  );

  useLoadDocs({ collection: 'person', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  if (!person) {
    return <Redirect to="/relationships/overview" />;
  }

  const newPageOnClick = () => {
    const maxPerson = _.maxBy(personDocs, 'position');
    const maxPosition = _.get(maxPerson, 'position') || 0;
    const position = maxPosition + 1;

    axiosPost(
      '/api/person',
      { position },
      { collection: 'person', loadDocsAction },
    ).then(({ docs }) => {
      const personId = _.get(docs, '[0].id');
      personId && history.push(`/relationships/${personId}`);
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidetab}>
        <NavLink to="/relationships/overview" activeClassName={styles.active}>
          Overview
        </NavLink>
      </div>

      {_.isEmpty(personDocs) ? (
        <div className={styles.sidebarFaded}>No relationships yet.</div>
      ) : (
        _.map(personDocs, ({ id, header }) => (
          <div key={id} className={styles.sidetab}>
            <NavLink
              to={`/relationships/${id}`}
              activeClassName={styles.active}
            >
              {header || 'Untitled'}
            </NavLink>

            <IoIosClose className={styles.tabMore} />
          </div>
        ))
      )}

      <div className={styles.newPage} onClick={newPageOnClick}>
        New Relationship
        <IoIosAdd />
      </div>
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'person',
    filter: 'none',
    prop: 'personDocs',
    orderBy: ['position'],
  }),
  { loadDocsAction },
)(PersonSidebar);
