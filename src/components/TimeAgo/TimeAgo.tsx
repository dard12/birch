import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  timestamp: Date | string;
}

function TimeAgo(props: TimeAgoProps) {
  const { timestamp } = props;

  return (
    <React.Fragment>
      {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
    </React.Fragment>
  );
}

export default TimeAgo;
