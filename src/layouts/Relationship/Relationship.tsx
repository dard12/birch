import React from 'react';
import styles from './Relationship.module.scss';
import PersonSidebar from '../../containers/PersonSidebar/PersonSidebar';
import Person from '../../containers/Person/Person';
import RelationshipOverview from '../RelationshipOverview/RelationshipOverview';

interface RelationshipProps {
  person?: string;
}

function Relationship(props: RelationshipProps) {
  const { person } = props;

  return (
    <div className={styles.relationshipPage}>
      <PersonSidebar person={person} />

      <div>
        {person === 'overview' ? (
          <RelationshipOverview />
        ) : (
          person && <Person person={person} />
        )}
      </div>
    </div>
  );
}

export default Relationship;
