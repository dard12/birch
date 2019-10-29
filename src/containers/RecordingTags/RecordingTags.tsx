import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Tag from '../Tag/Tag';
import { loadDocsAction } from '../../redux/actions';

interface RecordingTagsProps {
  recording?: number;
  loadDocsAction?: Function;
}

function RecordingTags(props: RecordingTagsProps) {
  const { recording, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/tag',
    { recording },
    { name: 'RecordingTags' },
  );

  useLoadDocs({ collection: 'tag', result, loadDocsAction });

  if (!isSuccess) {
    return null;
  }

  return (
    <React.Fragment>
      {_.map(result.docs, ({ id }) => (
        <Tag tag={id} key={id} />
      ))}
    </React.Fragment>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(RecordingTags);
