import React, { useState } from 'react';
import _ from 'lodash';
import CommentListPage from '../CommentListPage/CommentListPage';
import styles from './CommentList.module.scss';
import CommentBox from '../CommentBox/CommentBox';

interface CommentListProps {
  target_gid: string;
  type: 'recording' | 'release_group';
  pageSize?: number;
}

function CommentList(props: CommentListProps) {
  const { target_gid, type, pageSize = 5 } = props;
  const [page, setPage] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const params = { target_gid, pageSize };
  const onCommentSubmit = () => setLastUpdate(new Date());

  return (
    <div className={styles.commentList}>
      {_.map(_.reverse(_.range(page + 1)), currPage => (
        <CommentListPage
          key={currPage}
          params={{ ...params, page: currPage }}
          seeMore={currPage === page ? () => setPage(page + 1) : undefined}
          lastUpdate={lastUpdate}
        />
      ))}

      <CommentBox
        target_gid={target_gid}
        type={type}
        onCommentSubmit={onCommentSubmit}
      />
    </div>
  );
}

export default CommentList;
