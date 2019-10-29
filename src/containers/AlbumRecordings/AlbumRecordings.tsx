import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { ReleaseGroupDoc, RecordingDoc } from '../../../src-server/models';
import RecordingLink from '../RecordingLink/RecordingLink';
import styles from './AlbumRecordings.module.scss';
import { Button } from '../../components/Button/Button';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import { loadDocsAction } from '../../redux/actions';
import { Rating } from '../../components/Rating/Rating';

interface AlbumRecordingsProps {
  releaseGroupDoc: ReleaseGroupDoc;
  loadDocsAction?: Function;
}

function AlbumRecordings(props: AlbumRecordingsProps) {
  const { releaseGroupDoc, loadDocsAction } = props;
  const [seeMore, setSeeMore] = useState(false);
  const { recording_ids } = releaseGroupDoc;
  const { result, isSuccess } = useAxiosGet(
    '/api/recording',
    { recording_ids },
    { name: 'AlbumRecordings' },
  );

  useLoadDocs({ collection: 'recording', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton card count={4} />;
  }

  const { docs } = result;
  const truncateCutoff = 3;
  const hasMore = _.size(docs) > truncateCutoff;
  const toggleSeeMore = () => setSeeMore(!seeMore);
  const visibleRecordings: RecordingDoc[] = seeMore
    ? docs
    : _.take(docs, truncateCutoff);

  return (
    <div className={styles.albumRecordings}>
      <div className="heading-1">Album Tracks</div>
      <div className={styles.recordingList}>
        {_.map(visibleRecordings, (recordingDoc, index) => (
          <div className={styles.recording} key={recordingDoc.id}>
            <div className={styles.recordingName}>
              <span className={styles.recordingIndex}>{index + 1}. </span>
              <RecordingLink
                recordingDoc={recordingDoc}
                className={styles.recordingLink}
              />
            </div>

            <Rating
              rating={recordingDoc.rating}
              musicbrainz_rating={recordingDoc.musicbrainz_rating}
            />
          </div>
        ))}
      </div>

      <div className={styles.trackSeeMore}>
        {hasMore &&
          (seeMore ? (
            <Button className="btn" onClick={toggleSeeMore}>
              See Less
            </Button>
          ) : (
            <Button className="btn" onClick={toggleSeeMore}>
              See More
            </Button>
          ))}
      </div>
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(AlbumRecordings);
