import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IoIosCalendar } from 'react-icons/io';
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

  const { summary, start_date } = eventDoc;

  return (
    <div className={styles.event}>
      <IoIosCalendar />

      <Link to="#" className="hoverLink">
        {summary}
      </Link>

      {start_date && (
        <span className={styles.eventTime}>
          <TimeAgo timestamp={start_date} />.
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
