import React from 'react';
import { connect } from 'react-redux';
import { IoIosStar, IoIosAlbums, IoIosShareAlt } from 'react-icons/io';
import { useAxiosGet, useLoadDocs, axiosPost } from '../../hooks/useAxios';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import styles from './OnboardingTip.module.scss';
import { Button } from '../../components/Button/Button';

interface OnboardingTipProps {
  user: string;
  tipName: 'onboarding_welcome';
  userDoc?: UserDoc;
  loadDocsAction?: Function;
}

function OnboardingTip(props: OnboardingTipProps) {
  const { user, tipName, userDoc, loadDocsAction } = props;
  const params = { id: user };
  const { result, isSuccess } = useAxiosGet('/api/user', params, {
    name: 'OnboardingTip',
    cachedResult: userDoc,
  });

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!isSuccess || !userDoc || userDoc[tipName]) {
    return null;
  }

  const onClick = () => {
    axiosPost(
      '/api/user',
      { [tipName]: true },
      { collection: 'user', loadDocsAction },
    );
  };

  return (
    <div className={styles.tip}>
      <div className={styles.tipHeader}>
        <div>Hey friend,</div>
        <div>
          {"Here's"} how this <i>works</i>:
        </div>
      </div>

      <div className={styles.tipSteps}>
        <div className={styles.step}>
          <div className={styles.stepStars}>
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
          </div>
          <div className={styles.stepHeader}>Rate your Music</div>
          <div className={styles.stepDescription}>
            Search for your music and review them.
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <IoIosAlbums />
          </div>
          <div className={styles.stepHeader}>Curate a Collection</div>
          <div className={styles.stepDescription}>
            Your top picks will show up in your user profile.
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <IoIosShareAlt />
          </div>
          <div className={styles.stepHeader}>Share your Profile</div>
          <div className={styles.stepDescription}>
            Share your link. Show your friends {"what's"} good.
          </div>
        </div>
      </div>

      <div className={styles.tipFooter}>
        <Button className="btn" onClick={onClick}>
          Got It!
        </Button>
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
)(OnboardingTip);
