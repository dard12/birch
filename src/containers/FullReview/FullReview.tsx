import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import { ReviewDoc } from '../../../src-server/models';
import styles from './FullReview.module.scss';
import YourReview from '../YourReview/YourReview';
import RecordingThumbnail from '../RecordingThumbnail/RecordingThumbnail';
import { userSelector, createDocSelector } from '../../redux/selectors';
import Review from '../Review/Review';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import AlbumThumbnail from '../AlbumThumbnail/AlbumThumbnail';

interface FullReviewProps {
  user?: string;
  review?: string;
  reviewDoc?: ReviewDoc;
  loadDocsAction?: Function;
}

function FullReview(props: FullReviewProps) {
  const { user, review, reviewDoc, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/review',
    { 'ratings.review.id': review },
    { name: 'FullReview', cachedResult: reviewDoc },
  );

  useLoadDocs({ collection: 'review', result, loadDocsAction });

  if (!reviewDoc || !isSuccess) {
    return (
      <div className={styles.reviewRow}>
        <Skeleton card count={4} />
        <Skeleton card count={4} />
      </div>
    );
  }

  const { author_id, target_gid, id, type } = reviewDoc;
  const isOwnReview = user && user === author_id;

  return (
    <div className={styles.reviewRow}>
      {type === 'release_group' ? (
        <AlbumThumbnail
          release_group_gid={target_gid}
          className={styles.reviewThumbnail}
        />
      ) : (
        <RecordingThumbnail
          recording_gid={target_gid}
          className={styles.reviewThumbnail}
        />
      )}

      {isOwnReview ? (
        <YourReview review={id} target_gid={target_gid} type={type} />
      ) : (
        <Review review={id} />
      )}
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    userSelector,
    createDocSelector({
      collection: 'review',
      id: 'review',
      prop: 'reviewDoc',
    }),
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(FullReview);
