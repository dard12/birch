import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './UserFavorites.module.scss';
import { routeIncludes } from '../../history';

interface UserFavoritesProps {
  user?: string;
  userDoc?: UserDoc;
  loadDocsAction?: Function;
}

function UserFavorites(props: UserFavoritesProps) {
  const { user, userDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/user',
    { id: user },
    { name: 'UserFavorites', cachedResult: userDoc },
  );

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  const isProfile = routeIncludes('/profile');

  if (isProfile) {
    return null;
  }

  if (!userDoc) {
    return <Skeleton inline />;
  }

  const { username } = userDoc;

  return (
    <Link className={styles.favoriteLink} to={`/profile/${username}/songs`}>
      Favorite Songs
    </Link>
  );
}

export default connect(
  createDocSelector({
    collection: 'user',
    id: 'user',
    prop: 'userDoc',
  }),
  { loadDocsAction },
)(UserFavorites);
