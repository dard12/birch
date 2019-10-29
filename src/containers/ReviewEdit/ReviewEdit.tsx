import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './ReviewEdit.module.scss';
import { Rating } from '../../components/Rating/Rating';
import { Button } from '../../components/Button/Button';
import { axios } from '../../App';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { ReviewDoc } from '../../../src-server/models';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import Tooltip from '../../components/Tooltip/Tooltip';
import RichText from '../../components/RichText/RichText';
// import Dialog from '../../components/Dialog/Dialog';

interface ReviewEditProps {
  type: 'recording' | 'release_group';
  review?: string;
  reviewDoc?: ReviewDoc;
  target_gid?: string;
  loadDocsAction?: Function;
  onPublish?: Function;
  onClickCancel?: Function;
}

function ReviewEdit(props: ReviewEditProps) {
  const {
    type,
    review,
    reviewDoc,
    target_gid,
    loadDocsAction,
    onPublish,
    onClickCancel,
  } = props;
  const [content, setContent] = useState<any>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const { result } = useAxiosGet(
    '/api/review',
    { id: review },
    { name: 'ReviewEdit', cachedResult: reviewDoc },
  );

  useLoadDocs({ collection: 'review', result, loadDocsAction });

  if (reviewDoc) {
    content === undefined && setContent(reviewDoc.content);
    rating === undefined && setRating(reviewDoc.rating);
  }

  const allFieldsFilled = rating;

  const onClickPublish = () => {
    if (rating) {
      setSubmitting(true);

      axios
        .post('/api/review', { content, rating, target_gid, type })
        .then(() => {
          setSubmitting(false);
          onPublish && onPublish();
        })
        .catch(() => setSubmitting(false));
    }
  };

  // const onClickDelete = () => {
  //   axios.delete('/api/review', { data: { target_gid, type: 'recording' } }).then(() => {
  //     onPublish && onPublish();
  //   });
  // };

  return (
    <div className={styles.reviewForm}>
      <div className="form-field">
        <div className="text-1">Your Rating</div>
        <Rating
          rating={rating}
          onClick={setRating}
          editable
          className={styles.rating}
        />
      </div>

      <div className="form-field">
        <div className="text-1">Your Thoughts</div>

        <RichText
          onChange={setContent}
          content={content}
          placeholder="What do you think? (Optional)"
        />
      </div>

      <div className={styles.submitRow}>
        {reviewDoc && (
          <Button
            className="btn"
            color="grey"
            onClick={onClickCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}

        {/* {reviewDoc && (
          <Dialog
            buttonText="Delete Review"
            text="Are you sure you want to delete your review?"
            onConfirm={onClickDelete}
          />
        )} */}

        <Tooltip content="Please give a rating." enabled={!allFieldsFilled}>
          <Button
            color="pink"
            className="btn"
            onClick={onClickPublish}
            disabled={!allFieldsFilled}
            submitting={submitting}
          >
            {reviewDoc ? 'Publish Update' : 'Save Review'}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'review',
    id: 'review',
    prop: 'reviewDoc',
  }),
  { loadDocsAction },
)(ReviewEdit);
