import React from 'react';
import styles from './Relationship.module.scss';
import PersonSidebar from '../../containers/PersonSidebar/PersonSidebar';
import Person from '../../containers/Person/Person';

interface RelationshipProps {
  person?: string;
}

function Relationship(props: RelationshipProps) {
  const { person } = props;

  return (
    <div className={styles.relationshipPage}>
      <PersonSidebar person={person} />
      <div>{person && <Person person={person} />}</div>
    </div>
  );
}

export default Relationship;
