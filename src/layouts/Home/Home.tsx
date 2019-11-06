import React from 'react';
import styles from './Home.module.scss';
import RichText from '../../components/RichText/RichText';
import Note from '../../containers/Note/Note';

interface HomeProps {}

function Home(props: HomeProps) {
  return (
    <div className={styles.homePage}>
      <div className={styles.tasks}>
        <Note header="To Do" placeholder="What needs to get done?" />

        <div>
          <div className="heading-1">Reflect on This</div>
          <div className={styles.reflect}>
            <div className={styles.item}>
              <div>Have you practiced your strength recently?</div>
              <b>understanding</b>
            </div>
            <div className={styles.item}>
              <div>Has your weakness come up recently?</div>
              <b>upset</b>
            </div>
            <div className={styles.item}>
              <div>Have you been living your value?</div>
              <b>honesty</b>
            </div>
          </div>
        </div>
      </div>

      <Note
        header="Other Notes"
        placeholder="What's on your mind?"
        bullets={false}
      />
    </div>
  );
}

export default Home;
