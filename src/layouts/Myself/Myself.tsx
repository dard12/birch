import React from 'react';
import styles from './Myself.module.scss';
import RichText from '../../components/RichText/RichText';

interface MyselfProps {}

function Myself(props: MyselfProps) {
  return (
    <div className={styles.myselfPage}>
      <div>
        <div className="heading-1">Values</div>
        <div className={styles.journal}>
          <RichText placeholder="What are your values?" />
        </div>
      </div>

      <div className={styles.understanding}>
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

        <div>
          <div className="heading-1">Likes</div>
          <div className={styles.journal}>
            <RichText placeholder="What makes you happy?" />
          </div>
        </div>

        <div>
          <div className="heading-1">Dislikes</div>
          <div className={styles.journal}>
            <RichText placeholder="What makes you unhappy?" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myself;
