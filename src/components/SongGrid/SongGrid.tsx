import React from 'react';
import _ from 'lodash';
import RecordingThumbnail from '../../containers/RecordingThumbnail/RecordingThumbnail';
import styles from './SongGrid.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import AlbumThumbnail from '../../containers/AlbumThumbnail/AlbumThumbnail';

interface SongGridProps {
  type?: 'recording' | 'release_group';
  targetGids?: string[];
  loading?: number;
  showRating?: boolean;
}

function SongGrid(props: SongGridProps) {
  const { type, targetGids = [], loading, showRating = false } = props;

  if (loading) {
    return (
      <div className={styles.songGrid}>
        {_.times(4 * loading, index => (
          <div className={styles.songSkeleton} key={index}>
            <Skeleton card count={6} />
            <Skeleton count={3} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.songGrid}>
      {_.map(targetGids, gid => (
        <div className={styles.songContainer} key={gid}>
          {type === 'recording' ? (
            <RecordingThumbnail
              recording_gid={gid}
              className={styles.songThumbnail}
              showRating={showRating}
            />
          ) : (
            <AlbumThumbnail
              release_group_gid={gid}
              className={styles.songThumbnail}
              showRating={showRating}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default SongGrid;
