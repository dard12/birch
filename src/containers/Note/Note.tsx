import React from 'react';
import _ from 'lodash';
import styles from './Note.module.scss';
import RichText from '../../components/RichText/RichText';
import { useAxiosGet } from '../../hooks/useAxios';
import { NoteDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import { axios } from '../../App';

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
  const noteDoc: NoteDoc = _.get(result, 'docs[0]');

  if (!noteDoc || !isSuccess) {
    return <Skeleton card count={4} />;
  }

  const { id, content, header } = noteDoc;

  const onChange = _.debounce(newContent => {
    axios.post('/api/note', { id, header, content: newContent });
  }, 500);

  return (
    <div>
      <div className="heading-3">{header}</div>
      <div className={styles.note}>
        <RichText
          placeholder="What do you think?"
          onChange={onChange}
          content={content}
        />
      </div>
    </div>
  );
}

export default Note;
