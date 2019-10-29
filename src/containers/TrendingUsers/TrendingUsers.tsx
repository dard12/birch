import React from 'react';
import _ from 'lodash';
import { useAxiosGet } from '../../hooks/useAxios';
import styles from './TrendingUsers.module.scss';
import UserCard from '../UserCard/UserCard';
import Skeleton from '../../components/Skeleton/Skeleton';

function TrendingUsers() {
  const { result, isSuccess } = useAxiosGet(
    '/api/user',
    { sort: 'trending' },
    { name: 'TrendingUsers' },
  );

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const { docs } = result;

  return (
    <div className={styles.trendingList}>
      {_.isEmpty(docs) ? (
        <div className="faded">Nobody to follow yet.</div>
      ) : (
        _.map(docs, ({ id }) => (
          <div className={styles.trendingUser} key={id}>
            <UserCard user={id} />
          </div>
        ))
      )}
    </div>
  );
}

export default TrendingUsers;
