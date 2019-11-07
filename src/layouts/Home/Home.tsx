import React from 'react';
import styles from './Home.module.scss';
import NoteSidebar from '../../containers/NoteSidebar/NoteSidebar';

interface HomeProps {}

function Home(props: HomeProps) {
  return (
    <div className={styles.homePage}>
      <div>
        <NoteSidebar />
      </div>
      <div>Main</div>
    </div>
  );
}

export default Home;
