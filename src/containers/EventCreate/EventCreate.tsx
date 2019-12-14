import React, { useState } from 'react';
import { IoIosCalendar, IoIosAdd } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import { roundToNearestMinutes } from 'date-fns';
import styles from './EventCreate.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { Select } from '../../components/Select/Select';
import { axiosPost } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import { DatePicker } from '../../components/DatePicker/DatePicker';
import SelectPerson from '../SelectPerson/SelectPerson';

interface EventButtonProps {
  loadDocsAction?: Function;
}

const activities = [
  'Board Games',
  'Drinks',
  'Hangout',
  'Gym',
  'Food',
  'Coffee',
  'Movie',
];
const activityOptions = _.map(activities, value => ({ value, label: value }));

function EventButton(props: EventButtonProps) {
  const roundNow = roundToNearestMinutes(new Date(), { nearestTo: 30 });

  const [date, setDate] = useState(roundNow);
  const [time, setTime] = useState(roundNow);
  const [activity, setActivity] = useState();
  const [people, setPeople] = useState();

  const createOnClick = () => {
    axiosPost(
      '/api/event',
      { date, time, activity, people },
      { collection: 'event', loadDocsAction },
    );
  };

  return (
    <div className={styles.eventContainer}>
      <Modal
        buttonRender={openModal => (
          <Button className={styles.eventBtn} onClick={openModal}>
            <IoIosCalendar />
            New Event
          </Button>
        )}
        modalRender={closeModal => (
          <div className={styles.eventModal}>
            <div className={styles.modalContent}>
              <div className={styles.eventTitle}>
                {activity ? activity.label : 'New Event'}

                {activity && (_.isEmpty(people) ? ' with...' : ' with ')}

                {activity && _.truncate(_.join(_.map(people, 'label'), ', '))}
              </div>
              <div className={styles.datetimeRow}>
                <DatePicker
                  placeholder="Date"
                  value={date}
                  onChange={setDate}
                />

                <DatePicker
                  placeholder="Time"
                  value={time}
                  onChange={setTime}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'h:i K',
                  }}
                />
              </div>

              <Select
                placeholder="Activity"
                options={activityOptions}
                value={activity}
                onChange={setActivity}
              />

              <SelectPerson
                placeholder="Guests"
                value={people}
                onChange={setPeople}
                isMulti
                isSearchable
              />

              <div className={styles.createRow}>
                <a
                  href="https://calendar.google.com/calendar/r"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="btn" color="grey">
                    See Calendar
                  </Button>
                </a>

                <Button className={styles.createButton} onClick={createOnClick}>
                  <IoIosAdd />
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(EventButton);
