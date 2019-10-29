import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useAxiosGet } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import { ReviewDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';

interface LikeCountProps {
  review: string;
  reviewDoc?: ReviewDoc;
  lastUpdate?: Date;
}

function LikeCount(props: LikeCountProps) {
  const { review, reviewDoc, lastUpdate } = props;
  const [lastLoad, setLastLoad] = useState(new Date());
  const params = { 'ratings.review.id': review };
  const { result, isSuccess, setParams } = useAxiosGet('/api/review', params, {
    name: 'LikeCount',
    reloadOnChange: true,
    reloadCallback: () => setLastLoad(new Date()),
    cachedResult: reviewDoc,
  });
  const hasUpdated = lastUpdate && lastUpdate > lastLoad;

  if (hasUpdated) {
    setParams(params);
    setLastLoad(new Date());
  }

  if (!isSuccess) {
    return <Skeleton inline />;
  }

  const votes = _.toNumber(_.get(result, 'docs[0].vote'));

  return votes ? <div className="faded">{votes} likes</div> : <div />;
}

export default connect(
  createDocSelector({
    collection: 'review',
    id: 'review',
    prop: 'reviewDoc',
  }),
  { loadDocsAction },
)(LikeCount);
