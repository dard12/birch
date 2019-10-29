import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import _ from 'lodash';
import { getQueryParams } from './history';
import Navbar from './layouts/Navbar/Navbar';

const Home = lazy(() => import('./layouts/Home/Home'));
const Login = lazy(() => import('./layouts/Login/Login'));
const Profile = lazy(() => import('./layouts/Profile/Profile'));
const Search = lazy(() => import('./layouts/Search/Search'));
const RecordingProfile = lazy(() =>
  import('./layouts/RecordingProfile/RecordingProfile'),
);
const AlbumProfile = lazy(() => import('./layouts/AlbumProfile/AlbumProfile'));
const Charts = lazy(() => import('./layouts/Charts/Charts'));

function PrivateRoute({ component: Component, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={props => {
        const user = localStorage.getItem('id');

        return user ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
}

function App() {
  return (
    <React.Fragment>
      <Navbar />

      <div className="page-container">
        <Suspense fallback={null}>
          <Switch>
            <Route exact path="/login" render={props => <Login {...props} />} />
            <Route
              exact
              path="/register"
              render={props => <Login {...props} />}
            />
            <Route
              exact
              path="/search"
              render={props => (
                <Search queryParams={getQueryParams()} {...props} />
              )}
            />
            <Route
              path="/recording/:recording"
              render={props => (
                <RecordingProfile
                  recording={_.toInteger(props.match.params.recording)}
                  {...props}
                />
              )}
            />
            <Route
              path="/album/:release_group"
              render={props => (
                <AlbumProfile
                  release_group={_.toInteger(props.match.params.release_group)}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/charts"
              render={props => <Redirect to="/charts/best-albums-of-2019" />}
            />
            <Route
              path="/charts/:chart"
              render={props => <Charts chart={props.match.params.chart} />}
            />
            <Route
              path="/profile/:username"
              render={props => (
                <Profile
                  targetUsername={props.match.params.username}
                  {...props}
                />
              )}
            />

            <PrivateRoute path="/home" component={Home} />

            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Suspense>
      </div>
    </React.Fragment>
  );
}

const axios = Axios.create();

export { App, axios };
