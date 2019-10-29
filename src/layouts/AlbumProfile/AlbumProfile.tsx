import React from 'react';
import { connect } from 'react-redux';
import { createDocSelector } from '../../redux/selectors';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import { ReleaseGroupDoc } from '../../../src-server/models';
import ItemProfile from '../ItemProfile/ItemProfile';
import AlbumRecordings from '../../containers/AlbumRecordings/AlbumRecordings';
import Skeleton from '../../components/Skeleton/Skeleton';

interface AlbumProfileProps {
  release_group?: number;
  releaseGroupDoc?: ReleaseGroupDoc;
  loadDocsAction?: Function;
}

function AlbumProfile(props: AlbumProfileProps) {
  const { release_group, releaseGroupDoc, loadDocsAction } = props;
  const { result: releaseGroups } = useAxiosGet(
    '/api/release_group',
    { id: release_group },
    { name: 'AlbumProfile', cachedResult: releaseGroupDoc },
  );

  useLoadDocs({
    collection: 'release_group',
    result: releaseGroups,
    loadDocsAction,
  });

  return (
    <ItemProfile releaseGroupDoc={releaseGroupDoc}>
      {releaseGroupDoc ? (
        <AlbumRecordings releaseGroupDoc={releaseGroupDoc} />
      ) : (
        <Skeleton card count={4} />
      )}
    </ItemProfile>
  );
}

export default connect(
  createDocSelector({
    collection: 'release_group',
    id: 'release_group',
    prop: 'releaseGroupDoc',
  }),
  { loadDocsAction },
)(AlbumProfile);
