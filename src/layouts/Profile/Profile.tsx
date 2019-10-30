import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import styles from './Profile.module.scss';
import FollowButton from '../../containers/FollowButton/FollowButton';
import UserCard from '../../containers/UserCard/UserCard';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { UserDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import SignUp from '../../components/SignUp/SignUp';

interface ProfileProps {
  user?: string;
  userDoc?: UserDoc;
  targetUsername?: string;
  loadDocsAction?: Function;
}

function Profile(props: ProfileProps) {
  const { user, userDoc, targetUsername, loadDocsAction } = props;
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const onFollowChange = () => setLastUpdate(new Date());

  const params = { username: targetUsername };
  const { result } = useAxiosGet('/api/user', params, {
    name: 'Profile',
    reloadOnChange: true,
    cachedResult: userDoc,
  });

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!userDoc) {
    return (
      <div className={styles.profilePage}>
        <Skeleton card count={4} />
      </div>
    );
  }

  const targetUser = userDoc.id;
  const isMyProfile = user === targetUser;
  const profileLink = `birch.app/profile/${targetUsername}`;

  const copyLink = () => {
    const shareLink = document.querySelector('#share-link') as HTMLInputElement;

    if (shareLink) {
      shareLink.select();
      document.execCommand('copy');
      setCopied(true);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div>
        <div className={styles.profileCard}>
          <UserCard
            user={targetUser}
            lastUpdate={lastUpdate}
            badgeClassName={styles.profileBadge}
          />

          {user && isMyProfile && (
            <div className={styles.profileShare}>
              {copied && (
                <span className={styles.copiedText}>Copied link!</span>
              )}
              <input
                type="text"
                className={styles.profileLink}
                id="share-link"
                value={profileLink}
              />
              <Button className="btn" onClick={copyLink}>
                Share Link
              </Button>
            </div>
          )}

          {user && !isMyProfile && (
            <FollowButton
              targetUser={targetUser}
              onFollowChange={onFollowChange}
            />
          )}

          {!user && (
            <div>
              To follow this user please <SignUp />.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    userSelector,
    createDocSelector({
      collection: 'user',
      id: 'targetUsername',
      prop: 'userDoc',
    }),
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(Profile);
