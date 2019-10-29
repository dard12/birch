import React, { useState } from 'react';
import _ from 'lodash';
import { useAxiosGet } from '../../hooks/useAxios';
import styles from './CommentListPage.module.scss';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import UserBadge from '../UserBadge/UserBadge';
import UserName from '../UserName/UserName';

interface CommentListPageProps {
  params: any;
  seeMore?: Function;
  lastUpdate?: Date;
}

function CommentListPage(props: CommentListPageProps) {
  const { params, seeMore, lastUpdate } = props;
  const [lastLoad, setLastLoad] = useState(new Date());
  const { result, isSuccess, setParams } = useAxiosGet('/api/comment', params, {
    name: 'CommentListPage',
    reloadOnChange: true,
  });

  const hasUpdated = lastUpdate && lastUpdate > lastLoad;

  if (hasUpdated) {
    setParams(params);
    setLastLoad(new Date());
  }

  if (!isSuccess) {
    return (
      <React.Fragment>
        {_.times(5, index => (
          <div key={index}>
            <Skeleton count={2} />
          </div>
        ))}
      </React.Fragment>
    );
  }

  const { docs, next, page } = result;

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="faded">No comments yet.</div>
      ) : (
        <React.Fragment>
          {seeMore && next && (
            <div>
              <Button className={styles.previousComments} onClick={seeMore}>
                See previous comments
              </Button>
            </div>
          )}

          {_.map(
            _.orderBy(docs, 'created_at'),
            ({ author_id, content, id }) => (
              <div className={styles.commentRow} key={id}>
                <UserBadge user={author_id} />
                <div className={styles.commentContent}>
                  <div className={styles.commentAuthor}>
                    <UserName user={author_id} />
                  </div>
                  {content}
                </div>
              </div>
            ),
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default CommentListPage;
