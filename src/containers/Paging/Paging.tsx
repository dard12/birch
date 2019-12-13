import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './Paging.module.scss';
import { getQueryParams, setQueryParams } from '../../history';

interface PagingProps {
  component: any;
  props?: any;
  params?: any;
  className?: string;
  gridGap?: '2' | '3' | '4';
  seeMore?: boolean;
}

function Paging(props: PagingProps) {
  const {
    component: PageComponent,
    params = {},
    props: pageProps,
    className = styles.pageGrid,
    gridGap = '3',
    seeMore: showSeeMore = true,
  } = props;

  const initialPage = _.toNumber(getQueryParams('page')) || 0;
  const [page, setPage] = useState(initialPage);

  const seeMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setQueryParams({ page: nextPage });
  };

  let gapClass = styles.gridGap4;

  if (gridGap === '2') {
    gapClass = styles.gridGap2;
  } else if (gridGap === '3') {
    gapClass = styles.gridGap3;
  }

  return (
    <div className={classNames(className, gapClass)}>
      {_.map(_.range(page + 1), currPage => (
        <PageComponent
          key={currPage}
          params={{ ...params, page: currPage }}
          seeMore={showSeeMore && currPage === page ? seeMore : undefined}
          {...pageProps}
        />
      ))}
    </div>
  );
}

export default Paging;
