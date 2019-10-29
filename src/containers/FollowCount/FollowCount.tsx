import React, { useState } from 'react';
import { useAxiosGet } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';

interface FollowCountProps {
  target: 'following' | 'follower';
  user?: string;
  lastUpdate?: Date;
}

function FollowCount(props: FollowCountProps) {
  const { target, user, lastUpdate } = props;
  const [lastLoad, setLastLoad] = useState(new Date());
  const isFollowing = target === 'following';
  const opposite = isFollowing ? 'follower' : 'following';
  const params = { [opposite]: user, count: true };
  const { result, setParams, isSuccess } = useAxiosGet('/api/follow', params, {
    name: 'FollowCount',
    reloadOnChange: true,
    reloadCallback: () => setLastLoad(new Date()),
  });
  const hasUpdated = lastUpdate && lastUpdate > lastLoad;

  if (hasUpdated) {
    setParams(params);
    setLastLoad(new Date());
  }

  if (!isSuccess) {
    return <Skeleton inline />;
  }

  const { count } = result;

  return <React.Fragment>{count}</React.Fragment>;
}

export default FollowCount;
