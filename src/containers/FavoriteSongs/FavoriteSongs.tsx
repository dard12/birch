import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import SongGrid from '../../components/SongGrid/SongGrid';

interface FavoriteSongsProps {
  user?: string;
  loadDocsAction?: Function;
}

function FavoriteSongs(props: FavoriteSongsProps) {
  const { loadDocsAction, user } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/review',
    {
      'ratings.review.author_id': user,
      rating: 5,
      sort: 'review.rating',
      pageSize: 12,
      type: 'recording',
    },
    { name: 'FavoriteSongs' },
  );

  useLoadDocs({ collection: 'review', result, loadDocsAction });

  if (!isSuccess) {
    return <SongGrid loading={2} />;
  }

  const { docs } = result;
  const recordingGids = _.map(docs, 'target_gid');

  return _.isEmpty(docs) ? (
    <div className="card faded">No favorites yet.</div>
  ) : (
    <SongGrid type="recording" targetGids={recordingGids} />
  );
}

export default connect(
  null,
  { loadDocsAction },
)(FavoriteSongs);
