import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import styles from './EventSearchPage.module.scss';
import EventSearch from '../EventSearch/EventSearch';

interface EventSearchPageProps {
  person: string;
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function EventSearchPage(props: EventSearchPageProps) {
  const { person, params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/event', params, {
    reloadOnChange: true,
    name: 'EventSearchPage',
  });

  useLoadDocs({ collection: 'event', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const { docs, next, page } = result;

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className={styles.noEvent}>No events found.</div>
      ) : (
        _.map(docs, ({ id }) => (
          <EventSearch key={id} person={person} event={id} />
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
)(EventSearchPage);
