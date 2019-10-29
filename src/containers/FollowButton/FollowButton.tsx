import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from '../../components/Button/Button';
import { axios } from '../../App';
import { useAxiosGet } from '../../hooks/useAxios';
import { userSelector } from '../../redux/selectors';
import styles from './FollowButton.module.scss';

interface FollowButtonProps {
  user?: string;
  targetUser?: string;
  onFollowChange?: Function;
}

function FollowButton(props: FollowButtonProps) {
  const { user, targetUser, onFollowChange } = props;
  const params = {
    follower: user,
    following: targetUser,
  };
  const [isLoading, setIsLoading] = useState(false);
  const { result, setParams, isSuccess } = useAxiosGet('/api/follow', params, {
    name: 'FollowButton',
    reloadOnChange: true,
  });
  const docs = _.get(result, 'docs');
  const isFollowing = !_.isEmpty(docs);

  if (!user) {
    return null;
  }

  const followCallback = () => {
    setParams(params);
    onFollowChange && onFollowChange();
    setIsLoading(false);
  };

  const onClickFollow = () => {
    setIsLoading(true);

    axios.post('/api/follow', { following: targetUser }).then(followCallback);
  };

  const onClickUnfollow = () => {
    setIsLoading(true);

    axios
      .delete('/api/follow', { data: { following: targetUser } })
      .then(followCallback);
  };

  if (user === targetUser) {
    return null;
  }

  if (isLoading || !isSuccess) {
    return (
      <Button className="btn" disabled>
        Loading
      </Button>
    );
  }

  return isFollowing ? (
    <Button className={styles.follow} onClick={onClickUnfollow} />
  ) : (
    <Button className="btn" onClick={onClickFollow}>
      Follow
    </Button>
  );
}

export default connect(userSelector)(FollowButton);
