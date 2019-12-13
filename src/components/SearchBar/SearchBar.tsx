import React, { useState } from 'react';
import qs from 'qs';
import _ from 'lodash';
import { Input } from '../Input/Input';
import styles from './SearchBar.module.scss';
import history, { getQueryParams } from '../../history';

interface SearchBarProps {
  placeholder: string;
  pathname?: string;
  query?: string;
}

const submit = _.throttle((newQuery: string, pathname?: string) => {
  const queryParams = getQueryParams();
  queryParams.query = newQuery;
  const search = qs.stringify(queryParams);

  history.push({ pathname, search });
}, 300);

function SearchBar(props: SearchBarProps) {
  const { pathname, placeholder, query: initialQuery = '' } = props;
  const [query, setQuery] = useState(initialQuery);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.currentTarget.value;
    setQuery(newQuery);
    submit(newQuery, pathname);
  };

  return (
    <Input
      className={styles.searchBar}
      placeholder={placeholder}
      onChange={onChange}
      value={query}
    />
  );
}

export default SearchBar;
