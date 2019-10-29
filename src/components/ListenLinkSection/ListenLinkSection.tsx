import React from 'react';
import styles from './ListenLinkSection.module.scss';
import { ListenLink } from '../../components/ListenLink/ListenLink';

interface ListenLinkSectionProps {
  name: string;
  artist_name?: string;
}

function ListenLinkSection(props: ListenLinkSectionProps) {
  const { name, artist_name = '' } = props;
  const search = `${name} ${artist_name}`;

  return (
    <React.Fragment>
      <div className={styles.listenHeader}> Listen on </div>
      <ListenLink
        url={`https://open.spotify.com/search/${search}`}
        name="Spotify"
      />
      <ListenLink
        url={`https://www.youtube.com/results?search_query=${search}`}
        name="YouTube"
      />
      <ListenLink url={`https://genius.com/search?q=${search}`} name="Genius" />
      <ListenLink
        className="faded"
        url={`https://songwhip.com/create?q=${search}`}
        name="Others"
      />
    </React.Fragment>
  );
}

export default ListenLinkSection;
