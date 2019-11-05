import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './layouts/Navbar/Navbar';

const Home = lazy(() => import('./layouts/Home/Home'));
const Login = lazy(() => import('./layouts/Login/Login'));
const Profile = lazy(() => import('./layouts/Profile/Profile'));
const Myself = lazy(() => import('./layouts/Myself/Myself'));

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
            <Route
              exact
              path="/login"
              render={(props: any) => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              render={(props: any) => <Login {...props} />}
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
            <PrivateRoute path="/myself" component={Myself} />

            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Suspense>
      </div>
    </React.Fragment>
  );
}

const axios = Axios.create();

export { App, axios };
