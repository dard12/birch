import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Note.module.scss';
import RichText from '../../components/RichText/RichText';
import { useAxiosGet, axiosPost } from '../../hooks/useAxios';
import { NoteDoc } from '../../../src-server/models';
import { axios } from '../../App';
import { loadDocsAction } from '../../redux/actions';
import useFocus from '../../hooks/useFocus';

interface NoteProps {
  note: string;
  loadDocsAction?: Function;
}

function Note(props: NoteProps) {
  const { note, loadDocsAction } = props;
  const params = { id: note };
  const { result, isSuccess, setParams } = useAxiosGet('/api/note', params, {
    name: 'Note',
    reloadOnChange: true,
  });
  const [header, setHeader] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const noteDoc: NoteDoc = _.get(result, 'docs[0]');

  useFocus(() => setParams(params));

  if (!noteDoc || !isSuccess) {
    isLoaded && setIsLoaded(false);
    return null;
  }

  const { id, content, header: savedHeader } = noteDoc;

  if (!isLoaded) {
    setHeader(savedHeader);
    setIsLoaded(true);
  }

  const postContent = _.debounce(newContent => {
    axios.post('/api/note', { id, content: newContent });
  }, 500);

  const postHeader = _.debounce(header => {
    axiosPost(
      '/api/note',
      { id, header },
      { collection: 'note', loadDocsAction },
    );
  }, 500);

  const headerOnChange = (event: any) => {
    const header = event.currentTarget.value;
    setHeader(header);
    postHeader(header);
  };

  return (
    <div className={styles.note}>
      <TextareaAutosize
        className={styles.heading}
        value={header || ''}
        placeholder="Untitled"
        onChange={headerOnChange}
      />

      <RichText
        placeholder="What do you think?"
        onChange={postContent}
        content={content}
      />
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(Note);
