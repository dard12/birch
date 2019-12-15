import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IoIosCalendar } from 'react-icons/io';
import { format } from 'date-fns';
import styles from './EventSearch.module.scss';
import { EventDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { Button } from '../../components/Button/Button';

interface EventSearchProps {
  person: string;
  event: string;
  eventDoc?: EventDoc;
  loadDocsAction?: Function;
}

function EventSearch(props: EventSearchProps) {
  const { person, event, eventDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/event',
    { id: event },
    { name: 'EventSearch', cachedResult: eventDoc },
  );

  useLoadDocs({ collection: 'event', result, loadDocsAction });

  if (!eventDoc) {
    return null;
  }

  const { summary, people, start_date } = eventDoc;
  const hasPerson = _.includes(people, person);

  return (
    <div className={styles.event}>
      <IoIosCalendar />
      <div>{summary}</div>

      {start_date && (
        <span className={styles.eventTime}>
          on {format(new Date(start_date), 'MMM d')}
        </span>
      )}

      <div className={styles.addEvent}>
        {hasPerson ? <Button>Add</Button> : <Button>Remove</Button>}
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'event',
    id: 'event',
    prop: 'eventDoc',
  }),
  { loadDocsAction },
)(EventSearch);
