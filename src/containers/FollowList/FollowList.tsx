import React from 'react';
import FollowListPage from '../FollowListPage/FollowListPage';
import Paging from '../Paging/Paging';

interface FollowListProps {
  user: string;
  target: 'following' | 'follower';
}

function FollowList(props: FollowListProps) {
  const { user, target } = props;
  const isFollowing = target === 'following';
  const opposite = isFollowing ? 'follower' : 'following';
  const params = { [opposite]: user, pageSize: 10 };

  return (
    <Paging
      component={FollowListPage}
      props={{ target, isFollowing }}
      params={params}
    />
  );
}

export default FollowList;
