import React from 'react';
import styles from './Relationship.module.scss';
import PersonSidebar from '../../containers/PersonSidebar/PersonSidebar';

interface RelationshipProps {
  person?: string;
}

function Relationship(props: RelationshipProps) {
  const { person } = props;

  return (
    <div className={styles.relationshipPage}>
      <PersonSidebar person={person} />
      <div>{person && 'hello'}</div>
    </div>
  );
}

export default Relationship;
