import React from 'react';
import { connect } from 'react-redux';
import styles from '../RecordingThumbnail/RecordingThumbnail.module.scss';
import { Cover } from '../Cover/Cover';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { ReleaseGroupDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import AlbumLink from '../AlbumLink/AlbumLink';
import RecordingInfo from '../RecordingInfo/RecordingInfo';

interface AlbumThumbnailProps {
  release_group_gid: string;
  releaseGroupDoc?: ReleaseGroupDoc;
  className?: string;
  loadDocsAction?: Function;
  liteLoad?: boolean;
  showRating?: boolean;
}

function AlbumThumbnail(props: AlbumThumbnailProps) {
  const {
    release_group_gid,
    releaseGroupDoc,
    loadDocsAction,
    className = styles.resultThumbnail,
    liteLoad,
    showRating = false,
  } = props;

  const { result } = useAxiosGet(
    '/api/release_group',
    { gid: release_group_gid },
    { name: 'AlbumThumbnail', cachedResult: releaseGroupDoc },
  );

  useLoadDocs({ collection: 'release_group', result, loadDocsAction });

  if (!releaseGroupDoc) {
    return liteLoad ? <Skeleton count={4} /> : <Skeleton card count={4} />;
  }

  return (
    <div className={styles.result}>
      <AlbumLink releaseGroupDoc={releaseGroupDoc} className={className}>
        <Cover releaseGroupDoc={releaseGroupDoc} />
      </AlbumLink>

      <RecordingInfo
        releaseGroupDoc={releaseGroupDoc}
        showRating={showRating}
      />
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'release_group',
    id: 'release_group_gid',
    prop: 'releaseGroupDoc',
  }),
  { loadDocsAction },
)(AlbumThumbnail);
