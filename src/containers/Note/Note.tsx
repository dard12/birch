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
  type: string;
  placeholder: string;
  noteDoc?: NoteDoc;
  title?: string;
  header?: string;
  bullets?: boolean;
  loadDocsAction?: Function;
}

function Note(props: NoteProps) {
  const {
    type,
    title,
    header,
    placeholder,
    noteDoc,
    bullets = true,
    loadDocsAction,
  } = props;

  const { result, isSuccess } = useAxiosGet(
    '/api/note',
    { type },
    { name: 'Note', cachedResult: noteDoc },
  );

  useLoadDocs({ collection: 'note', result, loadDocsAction });

  const onChange = _.debounce(content => {
    axios.post('/api/note', { content, type });
  }, 1000);

  if (!isSuccess) {
    return <Skeleton card count={4} />;
  }

  const content = _.get(noteDoc, 'content');

  return (
    <div>
      {header && <div className="heading-1">{header}</div>}

      <div className={bullets ? styles.note : 'card'}>
        {title && <div className="heading-1">{title}</div>}
        <RichText
          placeholder={placeholder}
          onChange={onChange}
          content={content}
        />
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'note',
    id: 'type',
    prop: 'noteDoc',
  }),
  { loadDocsAction },
)(Note);
