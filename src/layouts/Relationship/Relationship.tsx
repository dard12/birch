import React from 'react';
import _ from 'lodash';
import styles from './Relationship.module.scss';
import PersonSidebar from '../../containers/PersonSidebar/PersonSidebar';
import Person from '../../containers/Person/Person';
import { EventDoc } from '../../../src-server/models';

interface RelationshipProps {
  person?: string;
}

function Relationship(props: RelationshipProps) {
  const { person } = props;

  return (
    <div className={styles.relationshipPage}>
      <PersonSidebar person={person} />

      <div>
        {person && (
          <Person
            person={person}
            eventFilter={(eventDoc: EventDoc) =>
              _.includes(eventDoc.people, person)
            }
          />
        )}
      </div>
    </div>
  );
}

export default Relationship;
