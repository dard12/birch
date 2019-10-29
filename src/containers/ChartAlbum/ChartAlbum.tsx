import React from 'react';
import { connect } from 'react-redux';
import styles from './ChartAlbum.module.scss';
import { Cover } from '../Cover/Cover';
import { loadDocsAction } from '../../redux/actions';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { ReleaseGroupDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import RecordingInfo from '../RecordingInfo/RecordingInfo';

interface ChartAlbumProps {
  position: number;
  release_group: number;
  releaseGroupDoc?: ReleaseGroupDoc;
  loadDocsAction?: Function;
}

function ChartAlbum(props: ChartAlbumProps) {
  const { position, release_group, releaseGroupDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/release_group',
    { id: release_group },
    { name: 'ChartAlbum', cachedResult: releaseGroupDoc },
  );

  useLoadDocs({ collection: 'release_group', result, loadDocsAction });

  if (!releaseGroupDoc) {
    return <Skeleton card count={4} />;
  }

  return (
    <div className={styles.chartItem}>
      <div className={styles.chartPosition}>{position}.</div>

      <div className={styles.chartThumbnail}>
        <Cover releaseGroupDoc={releaseGroupDoc} />
      </div>

      <RecordingInfo releaseGroupDoc={releaseGroupDoc} />
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'release_group',
    id: 'release_group',
    prop: 'releaseGroupDoc',
  }),
  { loadDocsAction },
)(ChartAlbum);
