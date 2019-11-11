import React from 'react';
import styles from './Home.module.scss';
import NoteSidebar from '../../containers/NoteSidebar/NoteSidebar';
import Note from '../../containers/Note/Note';

interface HomeProps {
  note?: string;
}

function Home(props: HomeProps) {
  const { note } = props;

  return (
    <div className={styles.homePage}>
      <NoteSidebar note={note} />
      {note && <Note note={note} />}
    </div>
  );
}

export default Home;
