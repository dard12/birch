import React from 'react';
import { IoMdStar } from 'react-icons/io';
import _ from 'lodash';
import styles from './AvgRating.module.scss';

interface AvgRatingProps {
  rating?: number;
  musicbrainz_rating?: number;
}

export default function AvgRating(props: AvgRatingProps) {
  const { rating: rawRating = 0, musicbrainz_rating = 0 } = props;
  const rating = _.round(rawRating || musicbrainz_rating / 20, 2).toFixed(1);

  return (
    <div className={styles.rating}>
      {rawRating || musicbrainz_rating ? (
        <React.Fragment>
          <IoMdStar className={styles.activeStar} />
          <span className={styles.ratingText}>
            {rating} <span className={styles.ratingSubtext}>/ 5</span>
          </span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <IoMdStar />
          <span className={styles.ratingSubtext}>Not Rated</span>
        </React.Fragment>
      )}
    </div>
  );
}
