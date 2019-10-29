import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { loadDocsAction } from '../../redux/actions';
import SimilarRecordingsPage from '../SimilarRecordingsPage/SimilarRecordingsPage';

interface SimilarRecordingsProps {
  recording: number;
  loadDocsAction?: Function;
}

const random = _.random(0.3, 0.7, true);
const randomDirection = _.random(0, 1, true) > 0.5 ? '>=' : '<=';

function SimilarRecordings(props: SimilarRecordingsProps) {
  const { recording } = props;
  const page = 0;
  const params = {
    similar: recording,
    type: 'recording',
    pageSize: 8,
    random,
    randomDirection,
  };

  return (
    <div>
      <div className="heading-1"> Discover More </div>
      {_.map(_.range(page + 1), currPage => (
        <SimilarRecordingsPage
          key={currPage}
          params={{ ...params, currPage }}
        />
      ))}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(SimilarRecordings);
