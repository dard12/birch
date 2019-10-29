import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';

interface UserNameProps {
  user?: string;
  userDoc?: UserDoc;
  loadDocsAction?: Function;
  plainName?: boolean;
}

function UserName(props: UserNameProps) {
  const { user, userDoc, loadDocsAction, plainName } = props;
  const { result } = useAxiosGet(
    '/api/user',
    { id: user },
    { name: 'UserName', cachedResult: userDoc },
  );

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!userDoc) {
    return <Skeleton inline />;
  }

  const { first_name, last_name, username } = userDoc;
  let displayName;

  if (first_name && last_name) {
    displayName = `${first_name} ${_.first(last_name)}.`;
  } else if (first_name) {
    displayName = first_name;
  } else {
    displayName = username;
  }

  return plainName ? (
    <React.Fragment>{displayName}</React.Fragment>
  ) : (
    <Link className="hoverLink" to={`/profile/${username}`}>
      {displayName}
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
)(UserName);
