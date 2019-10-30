import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import styles from './Home.module.scss';
import { userSelector } from '../../redux/selectors';
import OnboardingTip from '../../containers/OnboardingTip/OnboardingTip';

interface HomeProps {
  user?: string;
}

function Home(props: HomeProps) {
  const { user } = props;

  return (
    <div className={styles.homePage}>
      <div className={styles.homeFeed}>
        <MediaQuery minDeviceWidth={768}>
          {user && <OnboardingTip user={user} tipName="onboarding_welcome" />}
        </MediaQuery>
      </div>
      <div className={styles.homeSidebar}>
        <div>
          <a
            href="mailto:team@birch.app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.feedbackLink}
          >
            Got feedback? {"We'd"} love to hear it!
          </a>
        </div>
      </div>
    </div>
  );
}

export default connect(userSelector)(Home);
