import React from 'react';
import styles from './Note.module.scss';
import RichText from '../../components/RichText/RichText';

interface NoteProps {
  placeholder: string;
  title?: string;
  header?: string;
  bullets?: boolean;
}

function Note(props: NoteProps) {
  const { title, header, placeholder, bullets = true } = props;

  return (
    <div>
      {header && <div className="heading-1">{header}</div>}

      <div className={bullets ? styles.note : 'card'}>
        {title && <div className="heading-1">{title}</div>}
        <RichText placeholder={placeholder} />
      </div>
    </div>
  );
}

export default Note;
