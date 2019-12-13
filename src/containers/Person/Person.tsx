import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Person.module.scss';
import { useAxiosGet, axiosPost } from '../../hooks/useAxios';
import { PersonDoc, EventDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';
import RichText from '../../components/RichText/RichText';
import { axios } from '../../App';
import EventEdit from '../EventEdit/EventEdit';
import Paging from '../Paging/Paging';
import EventListPage from '../EventListPage/EventListPage';
import { createDocListSelector } from '../../redux/selectors';

interface PersonProps {
  person: string;
  eventFilter: any;
  personEvents?: EventDoc[];
  loadDocsAction?: Function;
}

function Person(props: PersonProps) {
  const { person, personEvents, loadDocsAction } = props;
  const params = { id: person };
  const { result, isSuccess, setParams } = useAxiosGet('/api/person', params, {
    name: 'Person',
    reloadOnChange: true,
  });
  const [header, setHeader] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const personDoc: PersonDoc = _.get(result, 'docs[0]');

  useFocus(() => setParams(params));

  if (!personDoc || !isSuccess) {
    isLoaded && setIsLoaded(false);
    return null;
  }

  const { id, content, header: savedHeader } = personDoc;

  if (!isLoaded) {
    setHeader(savedHeader);
    setIsLoaded(true);
  }

  const postContent = _.debounce(newContent => {
    axios.post('/api/person', { id, content: newContent });
  }, 500);

  const postHeader = _.debounce(header => {
    axiosPost(
      '/api/person',
      { id, header },
      { collection: 'person', loadDocsAction },
    );
  }, 500);

  const headerOnChange = (event: any) => {
    const header = event.currentTarget.value;
    setHeader(header);
    postHeader(header);
  };

  const numberEvents = _.size(personEvents);

  return (
    <div>
      <TextareaAutosize
        className={styles.heading}
        value={header || ''}
        placeholder="Untitled"
        onChange={headerOnChange}
      />

      <div className={styles.sections}>
        <div>
          <div className={styles.sectionLabel}>
            <span>Events {numberEvents ? `(${numberEvents})` : null}</span>
            <EventEdit />
          </div>

          <Paging
            component={EventListPage}
            params={{ people: [person] }}
            gridGap="2"
          />
        </div>

        <div>
          <div className={styles.sectionLabel}>Notes</div>
          <RichText
            placeholder="What do you think?"
            onChange={postContent}
            content={content}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'event',
    filter: 'eventFilter',
    prop: 'personEvents',
  }),
  { loadDocsAction },
)(Person);
