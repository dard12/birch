import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IoIosCalendar } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import styles from './EventListPage.module.scss';
import TimeAgo from '../../components/TimeAgo/TimeAgo';

interface EventListPageProps {
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function EventListPage(props: EventListPageProps) {
  const { params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/event', params, {
    reloadOnChange: true,
    name: 'EventListPage',
  });

  useLoadDocs({ collection: 'event', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const { docs, next, page } = result;

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className={styles.noEvent}>No events yet.</div>
      ) : (
        _.map(docs, ({ id, summary, start_date }) => (
          <div key={id} className={styles.event}>
            <IoIosCalendar />

            <Link to="#" className="hoverLink">
              {summary}
            </Link>

            {start_date && (
              <span className={styles.eventTime}>
                <TimeAgo timestamp={start_date} />.
              </span>
            )}
          </div>
        ))
      )}

      {seeMore && next && (
        <div>
          <Button className="btn" onClick={seeMore}>
            See More
          </Button>
        </div>
      )}
    </React.Fragment>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(EventListPage);
