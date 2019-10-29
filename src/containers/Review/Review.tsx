import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import _ from 'lodash';
import styles from './Review.module.scss';
import { Rating } from '../../components/Rating/Rating';
import { ReviewDoc } from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import LikeCount from '../LikeCount/LikeCount';
import LikeButton from '../LikeButton/LikeButton';
import { Button } from '../../components/Button/Button';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import UserCard from '../UserCard/UserCard';
import UserName from '../UserName/UserName';
import RichText, { getDelta } from '../../components/RichText/RichText';
import Truncate from '../../components/Truncate/Truncate';

interface ReviewProps {
  user?: string;
  review: string;
  reviewDoc?: ReviewDoc;
  editable?: boolean;
  onClickEdit?: any;
  loadDocsAction?: Function;
}

function Review(props: ReviewProps) {
  const {
    user,
    review,
    reviewDoc,
    editable,
    onClickEdit,
    loadDocsAction,
  } = props;

  const { result, isSuccess } = useAxiosGet(
    '/api/review',
    { 'ratings.review.id': review },
    { name: 'Review', cachedResult: reviewDoc },
  );

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const onLikeChange = () => setLastUpdate(new Date());

  useLoadDocs({ collection: 'review', result, loadDocsAction });

  if (!reviewDoc || !isSuccess) {
    return <Skeleton card count={4} />;
  }

  const { author_id, content, rating } = reviewDoc;
  const delta = getDelta(content);

  const deltaString = JSON.stringify(delta);
  const numberNewline = _.size(_.split(deltaString, /\\n/g));
  const shouldTruncate = delta.length() > 1300 || numberNewline > 20;

  return (
    <div className={styles.review}>
      <UserCard user={author_id} meta={rating && <Rating rating={rating} />} />

      {content ? (
        <Truncate shouldTruncate={shouldTruncate}>
          <RichText content={content} readOnly />
        </Truncate>
      ) : (
        <div className={styles.fadedContent}>
          {user === author_id ? 'You' : <UserName user={author_id} plainName />}{' '}
          rated this {rating} stars.
        </div>
      )}

      <div className={styles.reviewLikes}>
        <LikeCount review={review} lastUpdate={lastUpdate} />

        <div>
          {editable && onClickEdit ? (
            <Button className="btn" color="grey" onClick={onClickEdit}>
              Edit Review
            </Button>
          ) : (
            <LikeButton review={review} onLikeChange={onLikeChange} />
          )}
        </div>
      </div>
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
)(Review);
