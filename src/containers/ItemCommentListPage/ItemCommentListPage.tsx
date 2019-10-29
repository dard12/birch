import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import { loadDocsAction } from '../../redux/actions';
import { Button } from '../../components/Button/Button';
import fullReviewStyles from '../FullReview/FullReview.module.scss';
import ItemComment from '../ItemComment/ItemComment';

interface ItemCommentListPageProps {
  params?: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function ItemCommentListPage(props: ItemCommentListPageProps) {
  const { params = {}, seeMore, loadDocsAction } = props;

  params.distinct = true;

  const { result, isSuccess } = useAxiosGet('/api/comment', params, {
    name: 'ItemCommentListPage',
    reloadOnChange: true,
  });

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

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
        <div className="card faded">No comments yet.</div>
      ) : (
        <React.Fragment>
          {_.map(docs, ({ id }) => (
            <ItemComment comment={id} key={id} />
          ))}

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
)(ItemCommentListPage);
