import React from 'react';
import { connect } from 'react-redux';
import styles from './RecordingThumbnail.module.scss';
import { Cover } from '../Cover/Cover';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { RecordingDoc } from '../../../src-server/models';
import RecordingInfo from '../RecordingInfo/RecordingInfo';
import Skeleton from '../../components/Skeleton/Skeleton';
import RecordingLink from '../RecordingLink/RecordingLink';

interface RecordingThumbnailProps {
  recording_gid?: string;
  recordingDoc?: RecordingDoc;
  className?: string;
  loadDocsAction?: Function;
  showRating?: boolean;
}

function RecordingThumbnail(props: RecordingThumbnailProps) {
  const {
    recording_gid,
    recordingDoc,
    loadDocsAction,
    className = styles.resultThumbnail,
    showRating = false,
  } = props;

  const { result } = useAxiosGet(
    '/api/recording',
    { gid: recording_gid },
    { name: 'RecordingThumbnail', cachedResult: recordingDoc },
  );

  useLoadDocs({ collection: 'recording', result, loadDocsAction });

  if (!recordingDoc) {
    return <Skeleton card count={4} />;
  }

  return (
    <div className={styles.result}>
      <RecordingLink recordingDoc={recordingDoc} className={className}>
        <Cover recordingDoc={recordingDoc} />
      </RecordingLink>
      <RecordingInfo recordingDoc={recordingDoc} showRating={showRating} />
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'recording',
    id: 'recording_gid',
    prop: 'recordingDoc',
  }),
  { loadDocsAction },
)(RecordingThumbnail);
