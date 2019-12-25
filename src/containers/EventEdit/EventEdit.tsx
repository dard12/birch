import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './EventEdit.module.scss';
import Modal from '../../components/Modal/Modal';
import Paging from '../Paging/Paging';
import SearchBar from '../../components/SearchBar/SearchBar';
import { getQueryParams, setQueryParams } from '../../history';
import EventSearchPage from '../EventSearchPage/EventSearchPage';
import { axios } from '../../App';
import { PersonDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';

interface EventEditProps {
  person: string;
  personDoc?: PersonDoc;
  onClose: Function;
}

function EventEdit(props: EventEditProps) {
  const { person, personDoc, onClose } = props;
  const query = getQueryParams('query');

  const createOpenEdit = (openModal: any) => {
    return () => {
      axios.post('/api/event', { sync: true });
      openModal();
    };
  };

  return (
    <Modal
      onClose={() => {
        setQueryParams({ query: undefined });
        onClose();
      }}
      buttonRender={(openModal: any) => (
        <div className={styles.editEvents} onClick={createOpenEdit(openModal)}>
          Edit
        </div>
      )}
      modalRender={() => (
        <div className={styles.eventModal}>
          <div className={styles.modalContent}>
            <SearchBar
              placeholder="Search for events..."
              query={_.get(personDoc, 'header')}
              autoFocus
            />
            <Paging
              component={EventSearchPage}
              props={{ person }}
              params={{ search: query, pageSize: 10 }}
              gridGap="2"
            />
          </div>
        </div>
      )}
    />
  );
}

export default connect(
  createDocSelector({
    collection: 'person',
    id: 'person',
    prop: 'personDoc',
  }),
)(EventEdit);
