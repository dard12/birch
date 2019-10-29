import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Review from '../Review/Review';
import FullReview from '../FullReview/FullReview';
import Skeleton from '../../components/Skeleton/Skeleton';
import { loadDocsAction } from '../../redux/actions';
import { Button } from '../../components/Button/Button';
import fullReviewStyles from '../FullReview/FullReview.module.scss';

interface ReviewListPageProps {
  params?: any;
  includeThumbnail?: boolean;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function ReviewListPage(props: ReviewListPageProps) {
  const {
    params = {},
    includeThumbnail = true,
    seeMore,
    loadDocsAction,
  } = props;

  const { result, isSuccess } = useAxiosGet('/api/review', params, {
    name: 'ReviewListPage',
    reloadOnChange: true,
  });

  useLoadDocs({ collection: 'review', result, loadDocsAction });

  if (!isSuccess) {
    return (
      <React.Fragment>
        {_.times(5, index => (
          <div key={index} className={fullReviewStyles.reviewRow}>
            <div>
              <Skeleton card count={4} />
            </div>
            <Skeleton card count={6} />
          </div>
        ))}
      </React.Fragment>
    );
  }

  const { docs, next, page } = result;

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="card faded">No reviews yet.</div>
      ) : (
        <React.Fragment>
          {_.map(docs, ({ id }) => {
            return includeThumbnail ? (
              <FullReview review={id} key={id} />
            ) : (
              <Review review={id} key={id} />
            );
          })}

          {next && seeMore && (
            <div>
              <Button className="btn" onClick={seeMore}>
                See More
              </Button>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(ReviewListPage);
