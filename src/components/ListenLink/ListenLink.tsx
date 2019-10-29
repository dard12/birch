import React from 'react';
import classNames from 'classnames';
import styles from './ListenLink.module.scss';

interface ListenLinkProps {
  url?: string;
  name: string;
  className?: string;
}

export function ListenLink(props: ListenLinkProps) {
  const { url, name, className } = props;

  if (!url) {
    return null;
  }

  return (
    <div>
      <a
        className={
          className
            ? classNames(className, styles.listenLink)
            : styles.listenLink
        }
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </a>
    </div>
  );
}
