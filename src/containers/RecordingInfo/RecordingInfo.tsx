import React from 'react';
import { Link } from 'react-router-dom';
import { RecordingDoc, ReleaseGroupDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import RecordingLink from '../RecordingLink/RecordingLink';
import styles from './RecordingInfo.module.scss';
import { Rating } from '../../components/Rating/Rating';
import AlbumLink from '../AlbumLink/AlbumLink';

interface RecordingInfoProps {
  recordingDoc?: RecordingDoc;
  releaseGroupDoc?: ReleaseGroupDoc;
  showRating?: boolean;
}

function RecordingInfo(props: RecordingInfoProps) {
  const { recordingDoc, releaseGroupDoc, showRating = false } = props;
  const doc = recordingDoc || releaseGroupDoc;

  if (!doc) {
    return <Skeleton count={2} />;
  }

  const { artist_credit_name, artist_name, rating, musicbrainz_rating } = doc;

  return (
    <div className={styles.recordingInfo}>
      {recordingDoc ? (
        <RecordingLink recordingDoc={recordingDoc} className="bold hoverLink" />
      ) : (
        <AlbumLink
          releaseGroupDoc={releaseGroupDoc}
          className="bold hoverLink"
        />
      )}

      <Link
        to={`/search?query=${artist_credit_name || artist_name}`}
        className="hoverLink faded"
      >
        {artist_credit_name || artist_name}
      </Link>

      {showRating && (
        <Rating rating={rating} musicbrainz_rating={musicbrainz_rating} />
      )}
    </div>
  );
}

export default RecordingInfo;
