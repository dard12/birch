import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IoIosCalendar } from 'react-icons/io';
import { format } from 'date-fns';
import styles from './Event.module.scss';
import { EventDoc } from '../../../src-server/models';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import PersonName from '../PersonName/PersonName';

interface EventProps {
  event: string;
  eventDoc?: EventDoc;
  showPeople?: boolean;
  loadDocsAction?: Function;
}

function Event(props: EventProps) {
  const { event, eventDoc, showPeople, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/event',
    { id: event },
    { name: 'Event', cachedResult: eventDoc },
  );

  useLoadDocs({ collection: 'event', result, loadDocsAction });

  if (!eventDoc) {
    return null;
  }

  const { summary, people, start_date } = eventDoc;

  return (
    <div className={styles.event}>
      <IoIosCalendar />

      <div>{summary}</div>

      {start_date && (
        <span className={styles.eventTime}>
          on {format(new Date(start_date), 'MMM d')}
          {' — '}
          <TimeAgo timestamp={start_date} />.
        </span>
      )}

      {showPeople &&
        _.map(people, person => <PersonName person={person} key={person} />)}
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
)(Event);
