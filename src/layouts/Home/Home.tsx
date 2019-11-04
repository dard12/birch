import React from 'react';
import styles from './Home.module.scss';
import RichText from '../../components/RichText/RichText';

interface HomeProps {}

function Home(props: HomeProps) {
  return (
    <div className={styles.homePage}>
      <div className={styles.journal}>
        <RichText placeholder="What are you thinking?" />
      </div>
    </div>
  );
}

export default Home;
