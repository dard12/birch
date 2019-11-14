import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.scss';
import 'normalize.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { App } from './App.tsx';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './history';
import { withTracker } from './components/WithTracker/WithTracker';
import * as Sentry from '@sentry/browser';
import Helmet from 'react-helmet';
// import Landing from './layouts/Landing/Landing';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import TermsOfUse from './layouts/TermsOfUse/TermsOfUse';
import PrivacyPolicy from './layouts/PrivacyPolicy/PrivacyPolicy';
import UserGuidelines from './layouts/UserGuidelines/UserGuidelines';
// import 'cookieconsent';

Sentry.init({
  dsn: 'https://ec90141dbd46419ca6a2cf8d0a0a29cd@sentry.io/1524308',
});

// if (window.cookieconsent) {
//   window.cookieconsent.initialise({
//     cookie: { domain: 'www.birch.app' },
//     palette: null,
//     content: {
//       href: 'https://www.birch.app/legal/privacy-policy',
//       message: 'We use cookies to give you the best experience on our website.',
//     },
//   });
// }

const rootElement = document.getElementById('root');
const init = rootElement.hasChildNodes() ? hydrate : render;

init(
  <Provider store={store}>
    <Helmet>
      <title>Birch</title>
      <meta name="description" content="Birch" />
      <link rel="canonical" href="https://birch.app" />
    </Helmet>

    <Router history={history}>
      <ScrollToTop>
        <Switch>
          {/* <Route exact path="/" component={withTracker(Landing)} /> */}
          <Route exact path="/legal/terms-of-use" component={TermsOfUse} />
          <Route exact path="/legal/privacy-policy" component={PrivacyPolicy} />
          <Route
            exact
            path="/legal/user-guidelines"
            component={UserGuidelines}
          />

          <Route
            component={withTracker(App, {
              userId: localStorage.getItem('id'),
              username: localStorage.getItem('username'),
            })}
          />
        </Switch>
      </ScrollToTop>
    </Router>
  </Provider>,
  rootElement,
);
