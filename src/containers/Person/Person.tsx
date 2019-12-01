import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Person.module.scss';
import { useAxiosGet, axiosPost } from '../../hooks/useAxios';
import { PersonDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';

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

  const { id, first_name: savedHeader } = personDoc;

  if (!isLoaded) {
    setHeader(savedHeader);
    setIsLoaded(true);
  }

  const postHeader = _.debounce(input => {
    axiosPost(
      '/api/person',
      { id, first_name: input },
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
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(Person);
