import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { RecordingDoc } from '../../../src-server/models';

interface RecordingLinkProps {
  recordingDoc: RecordingDoc;
  children?: any;
  className?: string;
}

function RecordingLink(props: RecordingLinkProps) {
  const { recordingDoc, children, className } = props;
  const { id, name } = recordingDoc;
  const nameUrl = _.replace(
    _.replace(_.toLower(name), /[^a-z0-9]/gi, ' '),
    /\s/g,
    '-',
  );
  const link = `/recording/${id}/${nameUrl}`;

  return (
    <Link to={link} className={className}>
      {children || name}
    </Link>
  );
}

export default RecordingLink;
