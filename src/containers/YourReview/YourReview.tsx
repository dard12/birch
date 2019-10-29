import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { userSelector, createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { ReviewDoc } from '../../../src-server/models';
import ReviewEdit from '../ReviewEdit/ReviewEdit';
import Review from '../Review/Review';
import Skeleton from '../../components/Skeleton/Skeleton';

interface YourReviewProps {
  type: 'recording' | 'release_group';
  target_gid?: string;
  review?: string;
  reviewDoc?: ReviewDoc;
  loadDocsAction?: Function;
  user?: string;
}

function YourReview(props: YourReviewProps) {
  const { type, target_gid, reviewDoc, loadDocsAction, user } = props;
  const params = { target_gid, 'ratings.review.author_id': user };
  const { result, isSuccess, setParams } = useAxiosGet('/api/review', params, {
    name: 'YourReview',
    cachedResult: reviewDoc,
  });

  const [isEditing, setIsEditing] = useState(false);

  const onPublish = () => {
    setParams(params);
    setIsEditing(false);
  };

  const onClickEdit = () => {
    setIsEditing(true);
  };

  const onClickCancel = () => {
    setIsEditing(false);
  };

  useLoadDocs({ collection: 'review', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton card count={4} />;
  }

  const yourReview: ReviewDoc | undefined = _.first(result.docs);
  const review = _.get(yourReview, 'id');

  return isEditing || !review ? (
    <ReviewEdit
      type={type}
      target_gid={target_gid}
      review={review}
      onPublish={onPublish}
      onClickCancel={onClickCancel}
    />
  ) : (
    <Review review={review} editable onClickEdit={onClickEdit} />
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
)(YourReview);
