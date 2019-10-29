import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './ItemProfile.module.scss';
import { Cover } from '../../containers/Cover/Cover';
import { RecordingDoc, ReleaseGroupDoc } from '../../../src-server/models';
import RecordingTags from '../../containers/RecordingTags/RecordingTags';
import Skeleton from '../../components/Skeleton/Skeleton';
import AvgRating from '../../components/AvgRating/AvgRating';
import AlbumLink from '../../containers/AlbumLink/AlbumLink';
import ReviewSection from '../../containers/ReviewSection/ReviewSection';
import ListenLinkSection from '../../components/ListenLinkSection/ListenLinkSection';

interface ItemProfileProps {
  recording?: number;
  recordingDoc?: RecordingDoc;
  releaseGroupDoc?: ReleaseGroupDoc;
  children?: any;
  footer?: any;
}

function ItemProfile(props: ItemProfileProps) {
  const { recording, recordingDoc, releaseGroupDoc, children, footer } = props;
  const doc = recordingDoc || releaseGroupDoc;

  if (!doc) {
    return (
      <div className={styles.page}>
        <Skeleton card count={4} />
      </div>
    );
  }

  const {
    name,
    artist_name,
    artist_credit_name,
    rating,
    musicbrainz_rating,
    release_date_year,
    gid,
  } = doc;

  return (
    <div className={styles.page}>
      <div className={styles.profile}>
        <div className={styles.thumbnail}>
          <Cover
            recordingDoc={recordingDoc}
            releaseGroupDoc={releaseGroupDoc}
            type="large"
          />
        </div>

        <div>
          <div className={styles.title}> {name} </div>
          <Link
            to={`/search?query=${artist_credit_name || artist_name}`}
            className={styles.artist}
          >
            {artist_credit_name || artist_name}
          </Link>

          {recordingDoc && recordingDoc.release_group_name ? (
            <div>
              <AlbumLink
                recordingDoc={recordingDoc}
                className={classNames(styles.album, 'hoverLink')}
              />
            </div>
          ) : (
            release_date_year && (
              <div>
                <div className={styles.album}> {release_date_year} </div>
              </div>
            )
          )}

          <AvgRating rating={rating} musicbrainz_rating={musicbrainz_rating} />

          {recording && (
            <div>
              <RecordingTags recording={recording} />
            </div>
          )}

          <ListenLinkSection name={name} artist_name={artist_name} />
        </div>
      </div>

      {children}

      <ReviewSection
        target_gid={gid}
        type={recordingDoc ? 'recording' : 'release_group'}
      />

      {footer}
    </div>
  );
}

export default ItemProfile;
