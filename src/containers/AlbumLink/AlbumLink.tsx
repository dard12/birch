import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { RecordingDoc, ReleaseGroupDoc } from '../../../src-server/models';

interface AlbumLinkProps {
  recordingDoc?: RecordingDoc;
  releaseGroupDoc?: ReleaseGroupDoc;
  className?: string;
  children?: any;
}

function AlbumLink(props: AlbumLinkProps) {
  const { recordingDoc, releaseGroupDoc, className, children } = props;
  const id =
    _.get(recordingDoc, 'release_group_id') || _.get(releaseGroupDoc, 'id');
  const name =
    _.get(recordingDoc, 'release_group_name') || _.get(releaseGroupDoc, 'name');
  const release_date_year =
    _.get(recordingDoc, 'release_date_year') ||
    _.get(releaseGroupDoc, 'release_date_year');

  const nameUrl = _.replace(
    _.replace(_.toLower(name), /[^a-z0-9]/gi, ' '),
    /\s/g,
    '-',
  );
  const link = `/album/${id}/${nameUrl}`;

  return (
    <Link to={link} className={className}>
      {children || (
        <React.Fragment>
          {name}
          {release_date_year && ` (${release_date_year})`}
        </React.Fragment>
      )}
    </Link>
  );
}

export default AlbumLink;
