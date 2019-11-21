import React from 'react';
import {
  Link,
  withRouter,
  RouteComponentProps,
  NavLink,
} from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Navbar.module.scss';
import { logoutAction } from '../../redux/actions';
import { axios } from '../../App';
import { usernameSelector } from '../../redux/selectors';
import { Button } from '../../components/Button/Button';
import { IoIosRefresh } from 'react-icons/io';

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

        {/* {!username && (
          <NavLink
            exact
            to="/"
            className={styles.home}
            activeClassName={styles.active}
          >
            Home
          </NavLink>
        )} */}

        {username && (
          <NavLink to="/home" activeClassName={styles.active}>
            Home
          </NavLink>
        )}

        {username && (
          <NavLink to="/relationships" activeClassName={styles.active}>
            Relationships
          </NavLink>
        )}

        <Button className={styles.shuffleBtn}>
          <IoIosRefresh />
          What Should I Do
        </Button>

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
