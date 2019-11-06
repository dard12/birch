import React from 'react';
import styles from './Myself.module.scss';
import Note from '../../containers/Note/Note';

interface MyselfProps {}

function Myself(props: MyselfProps) {
  return (
    <div className={styles.myselfPage}>
      <Note title="Values" placeholder="What are your values?" />
      <Note title="Strengths" placeholder="What are your strengths?" />
      <Note title="Weaknesses" placeholder="What are your weaknesses?" />
      <Note title="Likes" placeholder="What makes you happy?" />
      <Note title="Dislikes" placeholder="What makes you unhappy?" />
    </div>
  );
}

export default Myself;
