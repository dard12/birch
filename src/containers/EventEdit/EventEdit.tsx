import React from 'react';
import styles from './EventEdit.module.scss';
import Modal from '../../components/Modal/Modal';
import Paging from '../Paging/Paging';
import SearchBar from '../../components/SearchBar/SearchBar';
import { getQueryParams, setQueryParams } from '../../history';
import EventSearchPage from '../EventSearchPage/EventSearchPage';

interface EventEditProps {
  person: string;
  onClose: Function;
}

function EventEdit(props: EventEditProps) {
  const { person, onClose } = props;
  const query = getQueryParams('query');

  return (
    <Modal
      onClose={() => {
        setQueryParams({ query: undefined });
        onClose();
      }}
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
              component={EventSearchPage}
              props={{ person }}
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
