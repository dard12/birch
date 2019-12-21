import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IoIosCalendar } from 'react-icons/io';
import { format } from 'date-fns';
import styles from './EventSearch.module.scss';
import { EventDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs, axiosPost } from '../../hooks/useAxios';
import { Button } from '../../components/Button/Button';
import getEventTime from '../../components/EventTime/EventTime';

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

  const { summary, people, start } = eventDoc;
  const hasPerson = _.includes(people, person);

  const updatePeople = (newPeople: string[]) => {
    axiosPost(
      '/api/event',
      { id: event, people: newPeople },
      { collection: 'event', loadDocsAction },
    );
  };

  const addOnClick = () => {
    const newPeople = _.concat(people, person);
    updatePeople(newPeople);
  };

  const removeOnClick = () => {
    const newPeople = _.without(people, person);
    updatePeople(newPeople);
  };

  const eventTime = getEventTime(start);

  return (
    <div className={styles.event}>
      <IoIosCalendar />
      <div>{summary}</div>

      {eventTime && (
        <span className={styles.eventTime}>
          on {format(eventTime, 'MMM d')}
        </span>
      )}

      <div className={styles.addEvent}>
        {hasPerson ? (
          <Button color="grey" onClick={removeOnClick}>
            Remove
          </Button>
        ) : (
          <Button onClick={addOnClick}>Add</Button>
        )}
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
