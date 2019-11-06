import React from 'react';
import styles from './Myself.module.scss';
import Note from '../../containers/Note/Note';

interface MyselfProps {}

function Myself(props: MyselfProps) {
  return (
    <div className={styles.myselfPage}>
      <Note type="values" title="Values" placeholder="What are your values?" />
      <Note
        type="strengths"
        title="Strengths"
        placeholder="What are your strengths?"
      />
      <Note
        type="weaknesses"
        title="Weaknesses"
        placeholder="What are your weaknesses?"
      />
      <Note type="likes" title="Likes" placeholder="What makes you happy?" />
      <Note
        type="dislikes"
        title="Dislikes"
        placeholder="What makes you unhappy?"
      />
    </div>
  );
}

export default Myself;
