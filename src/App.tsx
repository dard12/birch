import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './layouts/Navbar/Navbar';

const Login = lazy(() => import('./layouts/Login/Login'));
const Home = lazy(() => import('./layouts/Home/Home'));
const Reminder = lazy(() => import('./layouts/Reminder/Reminder'));
const Relationship = lazy(() => import('./layouts/Relationship/Relationship'));

function PrivateRoute({ component: Component, render, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={props => {
        const user = localStorage.getItem('id');

        if (!user) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }

        return Component ? <Component {...props} user={user} /> : render(props);
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

            <PrivateRoute exact path="/reminders" component={Reminder} />
            <PrivateRoute
              path="/reminders/:reminder"
              render={(props: any) => (
                <Reminder reminder={props.match.params.reminder} {...props} />
              )}
            />

            <PrivateRoute exact path="/notes" component={Home} />
            <PrivateRoute
              path="/notes/:note"
              render={(props: any) => (
                <Home note={props.match.params.note} {...props} />
              )}
            />

            <PrivateRoute path="/relationships" component={Relationship} />

            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        </Suspense>
      </div>
    </React.Fragment>
  );
}

const axios = Axios.create();

export { App, axios };
