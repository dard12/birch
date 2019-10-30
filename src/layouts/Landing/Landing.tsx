import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Landing.module.scss';
import Navbar from '../Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { userSelector } from '../../redux/selectors';

interface LandingProps {
  user?: string;
}

function Landing(props: LandingProps) {
  const { user } = props;

  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <React.Fragment>
      <Navbar />

      <div>
        <div className={styles.landingHeader}>
          <div className={styles.landingContent}>
            <div className={styles.landingTitle}>
              <i>The</i> social network for <b>music-lovers</b>.
            </div>

            <Link to="/register" className="ctaButton">
              Get Started — {"It's"} Free!
            </Link>
          </div>
        </div>

        <div className={styles.landingSlide}>
          <div className={styles.landingContent}>
            <h2>
              Explore <b>20 million</b> songs.
            </h2>
            <h2>
              <b>Listen</b> on all major streaming platforms.
            </h2>
            <h2>
              <b>Rate</b> your music ⁠— show your friends <i>{"what's"} good</i>
              .
            </h2>

            <Link to="/register" className="ctaButton">
              Sign Up
            </Link>

            <Link
              to="/charts/best-albums-of-2019"
              className="ctaButtonSecondary"
            >
              See Top Albums
            </Link>
          </div>
        </div>

        <div className={styles.landingFeed}>
          <div className={styles.landingReviews}>Recent Music Reviews</div>

          <div className={styles.landingFeedCTA}>
            <Link to="/register" className="ctaButton">
              Sign Up
            </Link>

            <Link
              to="/charts/best-albums-of-2019"
              className="ctaButtonSecondary"
            >
              See Top Albums
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
}

export default connect(userSelector)(Landing);
