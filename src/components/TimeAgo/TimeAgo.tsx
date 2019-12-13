import React from 'react';
import { formatDistanceToNow, parseJSON } from 'date-fns';

interface TimeAgoProps {
  timestamp: Date;
}

function TimeAgo(props: TimeAgoProps) {
  const { timestamp } = props;

  return (
    <React.Fragment>
      {formatDistanceToNow(parseJSON(timestamp), { addSuffix: true })}
    </React.Fragment>
  );
}

export default TimeAgo;
