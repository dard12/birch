import React from 'react';
import styles from './EventEdit.module.scss';
import Modal from '../../components/Modal/Modal';
import Paging from '../Paging/Paging';
import EventListPage from '../EventListPage/EventListPage';
import SearchBar from '../../components/SearchBar/SearchBar';
import { getQueryParams, setQueryParams } from '../../history';

interface EventEditProps {}

function EventEdit(props: EventEditProps) {
  const query = getQueryParams('query');

  return (
    <Modal
      onClose={() => setQueryParams({ query: undefined })}
      buttonRender={(openModal: any) => (
        <div className={styles.editEvents} onClick={openModal}>
          Edit
        </div>
      )}
      modalRender={closeModal => (
        <div className={styles.eventModal}>
          <div className={styles.modalContent}>
            <SearchBar placeholder="Search for events..." />
            <Paging
              component={EventListPage}
              params={{ search: query }}
              gridGap="2"
            />
          </div>
        </div>
      )}
    />
  );
}

export default EventEdit;
