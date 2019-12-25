import React from 'react';
import { connect } from 'react-redux';
import { IoIosCalendar } from 'react-icons/io';
import { format } from 'date-fns';
import styles from './Event.module.scss';
import { EventDoc } from '../../../src-server/models';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';

interface EventProps {
  event: string;
  eventDoc?: EventDoc;
  loadDocsAction?: Function;
}

function Event(props: EventProps) {
  const { event, eventDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/event',
    { id: event },
    { name: 'Event', cachedResult: eventDoc },
  );

  useLoadDocs({ collection: 'event', result, loadDocsAction });

  if (!eventDoc) {
    return null;
  }

  const { summary, parsed_start } = eventDoc;

  return (
    <div className={styles.event}>
      <IoIosCalendar />

      <div>{summary}</div>

      {parsed_start && (
        <span className={styles.eventTime}>
          on {format(new Date(parsed_start), 'MMM d')}
          {' — '}
          <TimeAgo timestamp={parsed_start} />.
        </span>
      )}
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
