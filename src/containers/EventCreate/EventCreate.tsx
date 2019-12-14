import React, { useState } from 'react';
import { IoIosCalendar, IoIosAdd } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import styles from './EventCreate.module.scss';
import { Button } from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { Input } from '../../components/Input/Input';
import { Select } from '../../components/Select/Select';
import { axiosPost } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';

// import 'flatpickr/dist/themes/theme.css';

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
  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [activity, setActivity] = useState();
  const [friends, setFriends] = useState();

  const titleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.currentTarget.value;
    setTitle(title);
  };

  const createOnClick = () => {
    axiosPost(
      '/api/event',
      { title, date, time, activity, friends },
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
              <Input
                placeholder="Event Title"
                className={styles.eventTitle}
                value={title}
                onChange={titleOnChange}
              />

              <div className={styles.datetimeRow}>
                <Flatpickr placeholder="Date" value={date} onChange={setDate} />

                <Flatpickr
                  placeholder="Time"
                  value={time}
                  onChange={setTime}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                  }}
                />
              </div>

              <Select
                placeholder="Activity"
                options={activityOptions}
                value={activity}
                onChange={setActivity}
              />

              <Select
                placeholder="Invite Friends"
                options={[{ label: 'Person', value: 'person' }]}
                value={friends}
                onChange={setFriends}
              />

              <div className={styles.createRow}>
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
