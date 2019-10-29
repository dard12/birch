import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './Charts.module.scss';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import ChartAlbum from '../../containers/ChartAlbum/ChartAlbum';
import { loadDocsAction } from '../../redux/actions';
import SignUp from '../../components/SignUp/SignUp';
import { userSelector } from '../../redux/selectors';

interface ChartProps {
  user?: string;
  chart: string;
  loadDocsAction?: Function;
}

function Charts(props: ChartProps) {
  const { user, chart, loadDocsAction } = props;
  const best70s = 'best-albums-of-1970';
  const best80s = 'best-albums-of-1980';
  const best90s = 'best-albums-of-1990';
  const best2019 = 'best-albums-of-2019';
  const bestRap2019 = 'best-hip-hop-albums-of-2019';
  const bestAllTime = 'best-albums-of-all-time';
  const chartToYears: any = {
    [best70s]: [1970, 1979],
    [best80s]: [1980, 1989],
    [best90s]: [1990, 1999],
  };
  const chartToSort: any = {
    [best2019]: 'chart-2019',
    [bestRap2019]: 'chart-rap-2019',
  };
  const release_date_year = chartToYears[chart];
  const sort = chartToSort[chart] || 'chart';
  const { result } = useAxiosGet(
    '/api/release_group',
    { sort, release_date_year },
    { name: 'Charts', reloadOnChange: true },
  );

  useLoadDocs({ collection: 'release_group', result, loadDocsAction });

  const docs = _.get(result, 'docs');
  const chartToHeader: any = {
    [best70s]: "Best Albums of the 70's",
    [best80s]: "Best Albums of the 80's",
    [best90s]: "Best Albums of the 90's",
    [best2019]: 'Best Albums of 2019',
    [bestRap2019]: 'Best Hip-Hop Albums of 2019',
    [bestAllTime]: 'Best Albums of All Time',
  };
  const header = chartToHeader[chart];

  return (
    <div className={styles.chartsPage}>
      <Helmet>
        <title> {header} | Tilde </title>
        <meta
          name="description"
          content={`A list of the ${header} from Tilde. Tilde is a social network for music lovers. Sign up today!`}
        />
        <link rel="canonical" href={`https://tilde.app/charts/${chart}`} />
      </Helmet>

      <h1 className={styles.chartsHeader}>{header}</h1>

      <div className={styles.chartsDescription}>
        This is a list of the top ten <i>{header}</i> from Tilde. Go ahead —
        give them a listen and tell us what you think. Write reviews and share
        your personal top picks with friends.
      </div>

      <div className="tabs">
        <NavLink to={`/charts/${best70s}`} activeClassName="active">
          1970
        </NavLink>
        <NavLink to={`/charts/${best80s}`} activeClassName="active">
          1980
        </NavLink>
        <NavLink to={`/charts/${best90s}`} activeClassName="active">
          1990
        </NavLink>
        <NavLink to={`/charts/${best2019}`} activeClassName="active">
          2019
        </NavLink>
        <NavLink to={`/charts/${bestAllTime}`} activeClassName="active">
          All Time
        </NavLink>
      </div>

      <div className={styles.chartsFeed}>
        {result ? (
          _.map(docs, (doc, index: number) => (
            <ChartAlbum
              release_group={doc.id}
              position={index + 1}
              key={index}
            />
          ))
        ) : (
          <Skeleton card count={4} />
        )}

        {!user && (
          <div className="card">
            To write reviews please <SignUp />.
          </div>
        )}

        <div className={styles.discoverAlbumsRow}>
          <Link to="/search?type=release_group" className="ctaButton">
            Explore More Albums
          </Link>
          <Link to="/search?type=recording" className="ctaButtonSecondary">
            Explore Songs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default connect(
  userSelector,
  { loadDocsAction },
)(Charts);
