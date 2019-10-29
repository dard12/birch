import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SongGrid from '../../components/SongGrid/SongGrid';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import { Button } from '../../components/Button/Button';
import styles from './SimilarRecordingsPage.module.scss';

interface SimilarRecordingsPageProps {
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function SimilarRecordingsPage(props: SimilarRecordingsPageProps) {
  const { params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/recording', params, {
    name: 'SimilarRecordingsPage',
    reloadOnChange: true,
  });

  useLoadDocs({ collection: 'recording', result, loadDocsAction });

  if (!isSuccess) {
    return <SongGrid loading={2} />;
  }

  const { docs, next, page } = result;
  const recordingGids = _.map(docs, 'gid');

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="card faded">No similar songs found.</div>
      ) : (
        <React.Fragment>
          <SongGrid type="recording" targetGids={recordingGids} showRating />

          {seeMore && next && (
            <div className={styles.seeMore}>
              <Button className="btn" onClick={seeMore}>
                See More
              </Button>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(SimilarRecordingsPage);
