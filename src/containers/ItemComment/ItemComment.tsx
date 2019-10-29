import React from 'react';
import { connect } from 'react-redux';
import { ReviewDoc } from '../../../src-server/models';
import styles from '../FullReview/FullReview.module.scss';
import RecordingThumbnail from '../RecordingThumbnail/RecordingThumbnail';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import AlbumThumbnail from '../AlbumThumbnail/AlbumThumbnail';
import CommentList from '../CommentList/CommentList';

interface ItemCommentProps {
  comment?: string;
  commentDoc?: ReviewDoc;
  loadDocsAction?: Function;
}

function ItemComment(props: ItemCommentProps) {
  const { comment, commentDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/comment',
    { 'ratings.comment.id': comment },
    { name: 'ItemComment', cachedResult: commentDoc },
  );

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

  if (!commentDoc) {
    return (
      <div className={styles.reviewRow}>
        <Skeleton card count={4} />
        <Skeleton card count={4} />
      </div>
    );
  }

  const { target_gid, type } = commentDoc;

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

      <div className="card">
        <CommentList target_gid={target_gid} type={type} pageSize={3} />
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'comment',
    id: 'comment',
    prop: 'commentDoc',
  }),
  { loadDocsAction },
)(ItemComment);
