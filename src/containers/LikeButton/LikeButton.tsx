import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { IoMdHeart } from 'react-icons/io';
import { axios } from '../../App';
import { useAxiosGet } from '../../hooks/useAxios';
import { userSelector } from '../../redux/selectors';
import styles from './LikeButton.module.scss';
import Skeleton from '../../components/Skeleton/Skeleton';

interface LikeButtonProps {
  user?: string;
  review?: string;
  onLikeChange?: Function;
}

function LikeButton(props: LikeButtonProps) {
  const { user, review, onLikeChange } = props;
  const params = { review_id: review, author_id: user };
  const [isLoading, setIsLoading] = useState(false);
  const { result, setParams, isSuccess } = useAxiosGet('/api/vote', params, {
    name: 'LikeButton',
    reloadOnChange: true,
  });
  const isLike = _.get(result, 'sum') > 0;

  if (!user) {
    return null;
  }

  const callback = () => {
    setParams(params);
    onLikeChange && onLikeChange();
    setIsLoading(false);
  };

  const onClickLike = () => {
    setIsLoading(true);

    axios.post('/api/vote', { review_id: review }).then(callback);
  };

  const onClickUnlike = () => {
    setIsLoading(true);

    axios.delete('/api/vote', { data: { review_id: review } }).then(callback);
  };

  if (isLoading || !isSuccess) {
    return <Skeleton inline />;
  }

  return isLike ? (
    <div
      className={classNames(styles.likeButton, styles.active)}
      onClick={onClickUnlike}
    >
      <IoMdHeart className={styles.likeIcon} /> Like Review
    </div>
  ) : (
    <div className={styles.likeButton} onClick={onClickLike}>
      <IoMdHeart className={styles.likeIcon} /> Like Review
    </div>
  );
}

export default connect(userSelector)(LikeButton);
