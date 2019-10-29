import React from 'react';
import _ from 'lodash';
import { useAxiosGet } from '../../hooks/useAxios';
import UserCard from '../UserCard/UserCard';
import FollowButton from '../FollowButton/FollowButton';
import styles from './FollowListPage.module.scss';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';

interface FollowListPageProps {
  params: any;
  target: 'following' | 'follower';
  isFollowing: boolean;
  seeMore?: Function;
}

function FollowListPage(props: FollowListPageProps) {
  const { params, target, isFollowing, seeMore } = props;
  const { result, isSuccess } = useAxiosGet('/api/follow', params, {
    name: 'FollowListPage',
    reloadOnChange: true,
  });

  if (!isSuccess) {
    return <Skeleton card count={4} />;
  }

  const { docs, next, page } = result;

  return (
    <div className={styles.followsList}>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="card faded">
          {isFollowing ? 'You are not following anybody.' : 'No followers yet.'}
        </div>
      ) : (
        <React.Fragment>
          {_.map(docs, followDoc => (
            <div className={styles.followCard} key={followDoc.created_at}>
              <UserCard user={followDoc[target]} key={followDoc[target]} />
              <FollowButton targetUser={followDoc[target]} />
            </div>
          ))}

          {seeMore && next && (
            <div>
              <Button className="btn" onClick={seeMore}>
                See More
              </Button>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default FollowListPage;
