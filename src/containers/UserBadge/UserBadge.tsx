import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';

interface UserBadgeProps {
  user?: string;
  userDoc?: UserDoc;
  loadDocsAction?: Function;
  className?: string;
}

function UserBadge(props: UserBadgeProps) {
  const { user, userDoc, loadDocsAction, className = 'badge' } = props;
  const { result } = useAxiosGet(
    '/api/user',
    { id: user },
    { name: 'UserBadge', cachedResult: userDoc },
  );

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!userDoc) {
    return <Skeleton inline />;
  }

  const { username, first_name, facebook_id, photo } = userDoc;
  const letter = _.first(first_name) || _.first(username);
  let photoLink = photo;

  if (!photo && facebook_id) {
    const type = className === 'badge' ? 'square' : 'normal';
    photoLink = `https://graph.facebook.com/${facebook_id}/picture?type=${type}`;
  }

  return (
    <Link className={classNames(className)} to={`/profile/${username}`}>
      {photoLink ? <img src={photoLink} alt={username} /> : letter}
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
)(UserBadge);
