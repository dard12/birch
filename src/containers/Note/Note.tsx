import React, { useState } from 'react';
import _ from 'lodash';
import styles from './Note.module.scss';
import RichText from '../../components/RichText/RichText';
import { useAxiosGet } from '../../hooks/useAxios';
import { NoteDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import { axios } from '../../App';
import { Input } from '../../components/Input/Input';

interface NoteProps {
  note: string;
}

function Note(props: NoteProps) {
  const { note } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/note',
    { id: note },
    { name: 'Note', reloadOnChange: true },
  );
  const [header, setHeader] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const noteDoc: NoteDoc = _.get(result, 'docs[0]');

  if (!noteDoc || !isSuccess) {
    isLoaded && setIsLoaded(false);
    return <Skeleton card count={4} />;
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
    axios.post('/api/note', { id, header });
  }, 500);

  const headerOnChange = (event: any) => {
    const header = event.currentTarget.value;
    setHeader(header);
    postHeader(header);
  };

  return (
    <div className={styles.note}>
      <Input
        className={styles.header}
        value={header}
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

export default Note;
