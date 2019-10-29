import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import styles from './Home.module.scss';
import TrendingSongs from '../../containers/TrendingSongs/TrendingSongs';
import TrendingUsers from '../../containers/TrendingUsers/TrendingUsers';
import { userSelector } from '../../redux/selectors';
import OnboardingTip from '../../containers/OnboardingTip/OnboardingTip';
import Paging from '../../containers/Paging/Paging';
import ItemCommentListPage from '../../containers/ItemCommentListPage/ItemCommentListPage';
import ReviewListPage from '../../containers/ReviewListPage/ReviewListPage';

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

        <div className="tabs">
          <NavLink to="/home/reviews">Recent Reviews</NavLink>
          <NavLink to="/home/comments">Recent Comments</NavLink>
          <NavLink to="/home/friends">Reviews from Friends</NavLink>
        </div>

        <Switch>
          <Route
            path="/home/reviews"
            render={() => <Paging component={ReviewListPage} gridGap="4" />}
          />
          <Route
            path="/home/comments"
            render={() => (
              <Paging component={ItemCommentListPage} gridGap="4" />
            )}
          />
          <Route
            path="/home/friends"
            render={() => (
              <Paging
                component={ReviewListPage}
                params={{ follow: 'true', follower: user }}
                gridGap="4"
              />
            )}
          />
          <Route render={() => <Redirect to="/home/reviews" />} />
        </Switch>
      </div>
      <div className={styles.homeSidebar}>
        <div>
          <div className="heading-1">Trending Songs</div>
          <div className="card">
            <TrendingSongs />
          </div>
        </div>
        <div>
          <div className="heading-1">Who to Follow</div>
          <div className="card">
            <TrendingUsers />
          </div>

          <a
            href="mailto:team@tilde.com"
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
