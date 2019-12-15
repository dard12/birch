import React, { useState } from 'react';
import { IoIosCalendar, IoIosAdd } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  roundToNearestMinutes,
  getHours,
  setHours,
  getMinutes,
} from 'date-fns';
import styles from './EventCreate.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { Select } from '../../components/Select/Select';
import { axiosPost } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import { DatePicker } from '../../components/DatePicker/DatePicker';
import SelectPerson from '../SelectPerson/SelectPerson';
import { setMinutes } from 'date-fns/esm';

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

  const [date, setDate] = useState([roundNow]);
  const [time, setTime] = useState([]);
  const [activity, setActivity] = useState();
  const [people, setPeople] = useState();

  const peopleSummary = _.isEmpty(people)
    ? '...'
    : _.truncate(_.join(_.map(people, 'label'), ', '));
  const summary = activity
    ? `${activity.label} with ${peopleSummary}`
    : 'New Event';

  const createOnClick = (closeModal: any) => {
    return () => {
      const selectedTime = _.first(time);
      let start_date = _.first(date);

      if (selectedTime && start_date) {
        const hours = getHours(selectedTime);
        const minutes = getMinutes(selectedTime);

        start_date = setHours(start_date, hours);
        start_date = setMinutes(start_date, minutes);
      }

      axiosPost(
        '/api/event',
        {
          start_date,
          activity: _.get(activity, 'value'),
          people: _.map(people, 'value'),
          summary,
        },
        { collection: 'event', loadDocsAction },
      ).then(closeModal);
    };
  };

  return (
    <div className={styles.eventContainer}>
      <Modal
        onClose={() => {
          setDate([roundNow]);
          setTime([]);
          setActivity(null);
          setPeople(null);
        }}
        buttonRender={openModal => (
          <Button className={styles.eventBtn} onClick={openModal}>
            <IoIosCalendar />
            New Event
          </Button>
        )}
        modalRender={closeModal => (
          <div className={styles.eventModal}>
            <div className={styles.modalContent}>
              <div className={styles.eventTitle}>{summary}</div>
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
                    allowInput: true,
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
                  className={styles.calendarLink}
                  href="https://calendar.google.com/calendar/r"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check Calendar
                </a>

                <div className={styles.createButtons}>
                  <Button className="btn" color="grey" onClick={closeModal}>
                    Cancel
                  </Button>

                  <Button
                    className={styles.createButton}
                    onClick={createOnClick(closeModal)}
                  >
                    <IoIosAdd />
                    Create Event
                  </Button>
                </div>
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
