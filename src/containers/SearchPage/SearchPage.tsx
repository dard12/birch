import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { userSelector } from '../../redux/selectors';
import SignUp from '../../components/SignUp/SignUp';
import { Button } from '../../components/Button/Button';
import SongGrid from '../../components/SongGrid/SongGrid';
import styles from './SearchPage.module.scss';

interface SearchPageProps {
  type: 'recording' | 'release_group';
  params?: any;
  seeMore?: Function;
  user?: string;
  loadDocsAction?: Function;
}

function SearchPage(props: SearchPageProps) {
  const { type, params, seeMore, user, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(`/api/${type}`, params, {
    name: 'SearchPage',
    reloadOnChange: true,
  });

  useLoadDocs({ collection: type, result, loadDocsAction });

  if (!isSuccess) {
    return <SongGrid loading={3} />;
  }

  const { docs, next, page } = result;
  const targetGids = _.map(docs, 'gid');

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="faded card">
          No songs found. Try changing your search.
        </div>
      ) : (
        <React.Fragment>
          <SongGrid type={type} targetGids={targetGids} showRating />

          <div className={styles.gridFooter}>
            {!user && (
              <div className="card">
                Please <SignUp /> to see more results.
              </div>
            )}

            {user && next && page < 8 && seeMore && (
              <Button className="btn" onClick={seeMore}>
                See More
              </Button>
            )}

            {user && !next && page < 8 && (
              <div className="card faded">No more songs to show.</div>
            )}

            {user && page >= 8 && (
              <div className="card faded">Showing the first 100 results.</div>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default connect(
  userSelector,
  { loadDocsAction },
)(SearchPage);
