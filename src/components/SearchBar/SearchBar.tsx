import React, { useState, useEffect } from 'react';
import qs from 'qs';
import _ from 'lodash';
import { Input } from '../Input/Input';
import styles from './SearchBar.module.scss';
import history, { getQueryParams } from '../../history';

interface SearchBarProps {
  placeholder: string;
  pathname?: string;
  query?: string;
  autoFocus?: boolean;
}

const submit = _.throttle((newQuery: string, pathname?: string) => {
  const queryParams = getQueryParams();
  queryParams.query = newQuery;
  const search = qs.stringify(queryParams);

  history.push({ pathname, search });
}, 300);

function SearchBar(props: SearchBarProps) {
  const { pathname, placeholder, query: initialQuery = '', autoFocus } = props;
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    submit(query, pathname);
  }, [query, pathname]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <Input
      className={styles.searchBar}
      placeholder={placeholder}
      onChange={onChange}
      value={query}
      autoFocus={autoFocus}
    />
  );
}

export default SearchBar;
