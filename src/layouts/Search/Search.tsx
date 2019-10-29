import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './Search.module.scss';
import { SearchFilter } from '../../containers/SearchFilter/SearchFilter';
import ToggleGroup from '../../components/ToggleGroup/ToggleGroup';
import { setQueryParams } from '../../history';
import { userSelector } from '../../redux/selectors';
import SearchPage from '../../containers/SearchPage/SearchPage';

interface SearchProps {
  user?: string;
  queryParams?: any;
}

function Search(props: SearchProps) {
  const { user, queryParams } = props;
  const {
    query = '',
    years: initialYears = [1950, 2019],
    genres: initialGenres = [],
    languages: initialLanguages = [],
    type: initialType = 'recording',
    users: initialUsers = [],
    page: initialPage = 0,
  } = queryParams;

  const [page, setPage] = useState(_.toNumber(initialPage));
  const onLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setQueryParams({ page: nextPage });
  };

  const [type, setType] = useState<'recording' | 'release_group'>(initialType);
  const [queryYear, setQueryYear] = useState(_.map(initialYears, _.toInteger));
  const [displayYear, setDisplayYear] = useState(queryYear);
  const [genres, setGenres] = useState<string[]>(initialGenres);
  const [languages, setLanguages] = useState(initialLanguages);
  const [users, setUsers] = useState<string[]>(initialUsers);

  const params = {
    search: query,
    release_date_year: queryYear,
    genres,
    language_name: languages,
    users,
    user,
    pageSize: 12,
  };

  const allGenres = [
    'Pop',
    'Hip-Hop',
    'Country',
    'Dance / Electronic',
    'R&B',
    'Rock',
    'Soul',
    'Indie',
    'Folk',
    'Classical',
    'Jazz',
    'Metal',
    'Blues',
    'Alternative',
    'Techno',
    'Production Music',
  ];

  const allLanguages = [
    'English',
    'German',
    'Japanese',
    'French',
    'Spanish',
    'Italian',
    'Portugese',
    'Russian',
    'Finnish',
    'Dutch',
    'Swedish',
    'Chinese',
    'Korean',
  ];

  const allUsers = ['My Friends'];

  return (
    <div className={styles.searchPage}>
      <div className={styles.filterList}>
        <SearchFilter header="Genre" description="Show only pop, hip-hop, etc.">
          <ToggleGroup
            selection={genres}
            setSelection={(genres: string[]) => {
              setPage(0);
              setGenres(genres);
              setQueryParams({ genres });
            }}
            allOptions={allGenres}
          />
        </SearchFilter>

        <SearchFilter
          header="Favorites"
          description="Show only top picks from friends"
        >
          <ToggleGroup
            selection={users}
            setSelection={(users: string[]) => {
              setPage(0);
              setUsers(users);
              setQueryParams({ users });
            }}
            allOptions={allUsers}
          />
        </SearchFilter>

        <SearchFilter header="Year" description="Filter by the release year.">
          <div className={styles.filterLabel}>
            {displayYear[0]} - {displayYear[1]}
          </div>

          <Range
            min={1950}
            max={2019}
            value={displayYear}
            onChange={setDisplayYear}
            onAfterChange={(years: number[]) => {
              setPage(0);
              setQueryYear(years);
              setQueryParams({ years });
            }}
            pushable
          />
        </SearchFilter>

        <SearchFilter
          header="Language"
          description="Show only songs in english, etc."
        >
          <ToggleGroup
            selection={languages}
            setSelection={(languages: string[]) => {
              setPage(0);
              setLanguages(languages);
              setQueryParams({ languages });
            }}
            allOptions={allLanguages}
          />
        </SearchFilter>
      </div>

      <div>
        <div className={styles.searchHeader}>
          <span
            className={type === 'recording' ? styles.active : undefined}
            onClick={() => {
              setPage(0);
              setType('recording');
              setQueryParams({ type: 'recording' });
            }}
          >
            Songs
          </span>
          {' or '}
          <span
            className={type === 'release_group' ? styles.active : undefined}
            onClick={() => {
              setPage(0);
              setType('release_group');
              setQueryParams({ type: 'release_group' });
            }}
          >
            Albums
          </span>
        </div>

        {_.map(_.range(page + 1), currPage => (
          <SearchPage
            key={currPage}
            type={type}
            params={{ ...params, page: currPage }}
            seeMore={currPage === page ? onLoadMore : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default connect(userSelector)(Search);
