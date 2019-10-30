import React from 'react';
import { connect } from 'react-redux';
import UserName from '../UserName/UserName';
import UserBadge from '../UserBadge/UserBadge';
import FollowCount from '../FollowCount/FollowCount';
import styles from './UserCard.module.scss';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { UserDoc } from '../../../src-server/models';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';

interface UserCardProps {
  user?: string;
  userDoc?: UserDoc;
  lastUpdate?: Date;
  badgeClassName?: string;
  meta?: any;
  loadDocsAction?: Function;
}

function UserCard(props: UserCardProps) {
  const {
    user,
    userDoc,
    lastUpdate,
    badgeClassName,
    meta,
    loadDocsAction,
  } = props;

  const { result, isSuccess } = useAxiosGet(
    '/api/user',
    { id: user },
    { name: 'UserCard', cachedResult: userDoc },
  );

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={2} />;
  }

  return (
    <div className={styles.userCard}>
      <UserBadge user={user} className={badgeClassName} />

      <div className="truncate">
        <div className={styles.userLinks}>
          <UserName user={user} />
        </div>

        {meta || (
          <div className="faded">
            <FollowCount
              target="follower"
              user={user}
              lastUpdate={lastUpdate}
            />{' '}
            Followers
          </div>
        )}
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'user',
    id: 'user',
    prop: 'userDoc',
  }),
  { loadDocsAction },
)(UserCard);
