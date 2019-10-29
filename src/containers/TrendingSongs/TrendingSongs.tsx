import React from 'react';
import _ from 'lodash';
import { useAxiosGet } from '../../hooks/useAxios';
import RecordingInfo from '../RecordingInfo/RecordingInfo';
import styles from './TrendingSongs.module.scss';
import Skeleton from '../../components/Skeleton/Skeleton';

function TrendingSongs() {
  const { result, isSuccess } = useAxiosGet(
    '/api/recording',
    { sort: 'trending' },
    { name: 'TrendingSongs' },
  );

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const { docs } = result;

  return (
    <div className={styles.trendingList}>
      {_.isEmpty(docs) ? (
        <div className="faded">Nothing trending yet.</div>
      ) : (
        _.map(docs, (recordingDoc, index) => (
          <div className={styles.trendingSong} key={recordingDoc.id}>
            <div>{index + 1}.</div>
            <RecordingInfo recordingDoc={recordingDoc} />
          </div>
        ))
      )}
    </div>
  );
}

export default TrendingSongs;
