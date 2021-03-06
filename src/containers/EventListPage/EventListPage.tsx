import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import styles from './EventListPage.module.scss';
import Event from '../Event/Event';
import useLastLoad from '../../hooks/useLastLoad';

interface EventListPageProps {
  params: any;
  lastUpdate?: Date;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function EventListPage(props: EventListPageProps) {
  const { params, lastUpdate, seeMore, loadDocsAction } = props;
  const { result, isSuccess, setParams } = useAxiosGet('/api/event', params, {
    reloadOnChange: true,
    name: 'EventListPage',
  });

  useLastLoad({ setParams, params, lastUpdate });
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
        _.map(docs, ({ id }) => <Event key={id} event={id} />)
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
