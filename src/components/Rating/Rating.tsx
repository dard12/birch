import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { IoMdStar } from 'react-icons/io';
import styles from './Rating.module.scss';

interface RatingProps {
  editable?: boolean;
  rating?: number;
  musicbrainz_rating?: number;
  onClick?: (rating: number) => void;
  className?: string;
}

export function Rating(props: RatingProps) {
  const {
    editable = false,
    onClick,
    rating: rawRating = 0,
    musicbrainz_rating = 0,
    className = styles.ratingSize,
  } = props;
  const rating = _.round(rawRating || musicbrainz_rating / 20);

  return (
    <div className={className}>
      <span
        className={classNames(styles.ratingContainer, {
          [styles.rated]: rating,
          [styles.editable]: editable,
        })}
      >
        {_.times(5, index => (
          <IoMdStar
            className={classNames(styles.ratingStar, {
              [styles.active]: index + 1 === rating,
            })}
            onClick={() => onClick && onClick(index + 1)}
            key={index}
          />
        ))}
      </span>
    </div>
  );
}
