import React, { useState, useEffect } from 'react';
import qs from 'qs';
import MediaQuery from 'react-responsive';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import styles from './SearchBar.module.scss';
import history, { getQueryParams } from '../../history';

interface SearchBarProps {
  query?: string;
}

export function SearchBar(props: SearchBarProps) {
  const { query: initialQuery = '' } = props;
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const onKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      submit();
    }
  };

  const submit = () => {
    const queryParams = getQueryParams();
    queryParams.query = query;
    const search = qs.stringify(queryParams);

    history.push({ pathname: '/search', search });
  };

  return (
    <div className={styles.searchContainer}>
      <Input
        className={styles.searchBar}
        placeholder="Search for Songs, Artists, Albums..."
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={query}
      />

      <MediaQuery minDeviceWidth={768}>
        <Button className={styles.searchBtn} onClick={submit}>
          Search
        </Button>
      </MediaQuery>
    </div>
  );
}
