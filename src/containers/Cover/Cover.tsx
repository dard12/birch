import React from 'react';
import styles from './Cover.module.scss';
import { RecordingDoc, ReleaseGroupDoc } from '../../../src-server/models';

const Img = require('react-image');

interface CoverProps {
  recordingDoc?: RecordingDoc;
  releaseGroupDoc?: ReleaseGroupDoc;
  type?: 'small' | 'large';
}

export function Cover(props: CoverProps) {
  const { recordingDoc, releaseGroupDoc, type = 'small' } = props;
  const doc = recordingDoc || releaseGroupDoc;

  if (!doc) {
    return null;
  }

  const { release_gid, name, artist_name, cover_id } = doc;

  const textCover = (
    <div className={styles.textContainer}>
      <div>{name}</div>
    </div>
  );

  const imageType = type === 'small' ? '250' : '';

  if (!cover_id) {
    return textCover;
  }

  return (
    <Img
      src={`https://coverartarchive.org/release/${release_gid}/${cover_id}/${imageType}`}
      container={(children: any) => (
        <div className={styles.imageContainer}>{children}</div>
      )}
      loader={
        <div className={styles.textContainer}>
          <div className={styles.loading}>...</div>
        </div>
      }
      alt={`${name} by ${artist_name}`}
      unloader={textCover}
    />
  );
}
