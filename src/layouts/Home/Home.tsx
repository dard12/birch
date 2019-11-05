import React from 'react';
import styles from './Home.module.scss';
import RichText from '../../components/RichText/RichText';

interface HomeProps {}

function Home(props: HomeProps) {
  return (
    <div className={styles.homePage}>
      <div>
        <div className="heading-1">Reflect on This</div>
        <div className={styles.reflect}>
          <div className={styles.item}>
            One of your strengths is <b>being understanding</b>. Have you
            practiced it recently?
          </div>
          <div className={styles.item}>
            One of your weaknesses is <b>getting upset</b>. Has that happened
            recently? Are you making progress on it?
          </div>
        </div>
      </div>

      <div>
        <div className="heading-1">To Do</div>
        <div className={styles.journal}>
          <RichText placeholder="What needs to get done?" />
        </div>
      </div>

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
