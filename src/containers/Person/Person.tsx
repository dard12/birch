import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IoIosAdd } from 'react-icons/io';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Person.module.scss';
import { useAxiosGet, axiosPost } from '../../hooks/useAxios';
import { PersonDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';
import RichText from '../../components/RichText/RichText';
import { axios } from '../../App';

interface PersonProps {
  person: string;
  loadDocsAction?: Function;
}

function Person(props: PersonProps) {
  const { person, loadDocsAction } = props;
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
          <div className={styles.sectionLabel}>Notes</div>
          <RichText
            placeholder="What do you think?"
            onChange={postContent}
            content={content}
          />
        </div>

        <div>
          <div className={styles.sectionLabel}>Events</div>
          <div className={styles.timeline}>
            <div>
              <div className={styles.newItem}>
                New Event
                <IoIosAdd />
              </div>
            </div>
            <div className={styles.event}>asf</div>
            <div className={styles.event}>asf</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(Person);
