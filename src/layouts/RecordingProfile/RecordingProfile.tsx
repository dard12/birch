import React from 'react';
import { connect } from 'react-redux';
import { createDocSelector } from '../../redux/selectors';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import { RecordingDoc } from '../../../src-server/models';
import ItemProfile from '../ItemProfile/ItemProfile';
import SimilarRecordings from '../../containers/SimilarRecordings/SimilarRecordings';

interface RecordingProfileProps {
  recording?: number;
  recordingDoc?: RecordingDoc;
  loadDocsAction?: Function;
}

function RecordingProfile(props: RecordingProfileProps) {
  const { recording, recordingDoc, loadDocsAction } = props;
  const { result: recordings } = useAxiosGet(
    '/api/recording',
    { id: recording },
    { name: 'RecordingProfile', cachedResult: recordingDoc },
  );

  useLoadDocs({ collection: 'recording', result: recordings, loadDocsAction });

  return (
    <ItemProfile
      recording={recording}
      recordingDoc={recordingDoc}
      footer={recording && <SimilarRecordings recording={recording} />}
    />
  );
}

export default connect(
  createDocSelector({
    collection: 'recording',
    id: 'recording',
    prop: 'recordingDoc',
  }),
  { loadDocsAction },
)(RecordingProfile);
