import React from 'react';
import {
  Link,
  withRouter,
  RouteComponentProps,
  NavLink,
} from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Navbar.module.scss';
import { getQueryParams } from '../../history';
import { logoutAction } from '../../redux/actions';
import { axios } from '../../App';
import { SearchBar } from '../../containers/SearchBar/SearchBar';
import { usernameSelector } from '../../redux/selectors';

interface NavbarProps extends RouteComponentProps {
  logoutAction?: Function;
  username?: string;
}

function Navbar(props: NavbarProps) {
  const { logoutAction, username } = props;

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <Link to={username ? '/home' : '/'} className={styles.brand}>
          Birch
        </Link>

        <SearchBar query={getQueryParams('query')} />

        {username ? (
          <NavLink
            to="/home"
            className={styles.home}
            activeClassName={styles.active}
          >
            Home
          </NavLink>
        ) : (
          <NavLink
            exact
            to="/"
            className={styles.home}
            activeClassName={styles.active}
          >
            Home
          </NavLink>
        )}

        <NavLink to="/search" activeClassName={styles.active}>
          Music
        </NavLink>

        {username && (
          <NavLink to={`/profile/${username}`} activeClassName={styles.active}>
            Profile
          </NavLink>
        )}

        {username ? (
          <NavLink
            to="/"
            className={styles.logoutBtn}
            onClick={() => {
              axios.get('/logout');
              logoutAction && logoutAction();
            }}
          >
            Logout
          </NavLink>
        ) : (
          <React.Fragment>
            <NavLink to="/register" activeClassName={styles.active}>
              Sign up
            </NavLink>
            <NavLink to="/login" activeClassName={styles.active}>
              Login
            </NavLink>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default withRouter(
  connect(
    usernameSelector,
    { logoutAction },
  )(Navbar),
);
