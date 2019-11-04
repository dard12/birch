import React from 'react';
import styles from './Home.module.scss';
import RichText from '../../components/RichText/RichText';

interface HomeProps {}

function Home(props: HomeProps) {
  return (
    <div className={styles.homePage}>
      <div>
        <div className="heading-1">Values</div>
        <div className={styles.journal}>
          <RichText placeholder="What are your values?" />
        </div>
      </div>

      <div>
        <div className="heading-1">Strengths</div>
        <div className={styles.journal}>
          <RichText placeholder="What are your strengths?" />
        </div>
      </div>

      <div>
        <div className="heading-1">Weaknesses</div>
        <div className={styles.journal}>
          <RichText placeholder="What are your weaknesses?" />
        </div>
      </div>
    </div>
  );
}

export default Home;
