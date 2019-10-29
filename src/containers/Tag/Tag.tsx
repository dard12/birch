import React from 'react';
import { connect } from 'react-redux';
import styles from './Tag.module.scss';
import { TagDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import Skeleton from '../../components/Skeleton/Skeleton';

interface TagProps {
  tag: number;
  tagDoc?: TagDoc;
}

function Tag(props: TagProps) {
  const { tagDoc } = props;

  if (!tagDoc) {
    return <Skeleton inline />;
  }

  return tagDoc.name ? <div className={styles.tag}>{tagDoc.name}</div> : null;
}

export default connect(
  createDocSelector({ collection: 'tag', id: 'tag', prop: 'tagDoc' }),
)(Tag);
