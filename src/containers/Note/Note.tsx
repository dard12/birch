import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './Note.module.scss';
import RichText from '../../components/RichText/RichText';
import { axios } from '../../App';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { NoteDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';

interface NoteProps {
  note: string;
  placeholder: string;
  noteDoc?: NoteDoc;
  loadDocsAction?: Function;
}

function Note(props: NoteProps) {
  const { note, placeholder, noteDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/note',
    { id: note },
    { name: 'Note', cachedResult: noteDoc },
  );

  useLoadDocs({ collection: 'note', result, loadDocsAction });

  const onChange = _.debounce(content => {
    axios.post('/api/note', { content, id: note });
  }, 500);

  if (!noteDoc) {
    return <Skeleton card count={4} />;
  }

  const { content, header } = noteDoc;

  return (
    <div>
      <div className="heading-1">{header}</div>
      <RichText
        placeholder={placeholder}
        onChange={onChange}
        content={content}
      />
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'note',
    id: 'note',
    prop: 'noteDoc',
  }),
  { loadDocsAction },
)(Note);