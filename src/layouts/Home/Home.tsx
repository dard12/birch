import React from 'react';
import { connect } from 'react-redux';
import styles from './Home.module.scss';
import { userSelector } from '../../redux/selectors';
import RichText from '../../components/RichText/RichText';

interface HomeProps {
  user?: string;
}

function Home(props: HomeProps) {
  const { user } = props;

  return (
    <div className={styles.homePage}>
      <RichText />
    </div>
  );
}

export default connect(userSelector)(Home);
