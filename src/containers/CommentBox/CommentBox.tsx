import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './CommentBox.module.scss';
import { axios } from '../../App';
import UserBadge from '../UserBadge/UserBadge';
import { userSelector } from '../../redux/selectors';

interface CommentBoxProps {
  user?: string;
  target_gid: string;
  type: 'recording' | 'release_group';
  onCommentSubmit?: Function;
}

function CommentBox(props: CommentBoxProps) {
  const { user, target_gid, type, onCommentSubmit } = props;
  const [content, setContent] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };
  const onKeyPress = (event: React.KeyboardEvent) => {
    const isEnter = event.key === 'Enter';
    const isShift = event.shiftKey;

    if (isEnter) {
      if (!_.size(_.trim(content))) {
        event.preventDefault();
      } else if (!isShift && !isSubmitting) {
        event.preventDefault();
        setIsSubmitting(true);
        axios.post('/api/comment', { target_gid, type, content }).then(() => {
          setIsSubmitting(false);
          setContent('');
          onCommentSubmit && onCommentSubmit();
        });
      }
    }
  };

  return (
    <div className={styles.commentContainer}>
      <UserBadge user={user} />
      <div className={styles.commentBox}>
        <TextareaAutosize
          value={content}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Write a comment…"
        />
      </div>
    </div>
  );
}

export default connect(userSelector)(CommentBox);
