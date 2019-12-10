import express from 'express';
import path from 'path';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

const prerender = require('prerender-node');

const app = express();
const { NODE_ENV, SENTRY_DSN, PRERENDER_TOKEN, SERVER_PORT } = process.env;
const isProd = NODE_ENV === 'production';
const origin = isProd ? 'https://birch.app' : 'http://localhost';

if (isProd) {
  Sentry.init({ dsn: SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
  app.use(
    prerender
      .set('prerenderToken', PRERENDER_TOKEN)
      .whitelisted(['/', '/charts/best.*', '/search'])
      .blacklisted([
        '/profile.*',
        '/search.*',
        '/recording.*',
        '/album.*',
        '/register',
        '/login',
        '/legal.*',
      ]),
  );
}

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

export { app, router, origin, requireAuth, Sentry };

app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/', router);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

import './routes/auth';
import './routes/user';
import './routes/note';
import './routes/reminder';
import './routes/reminder_item';
import './routes/person';

if (isProd) {
  app.use(Sentry.Handlers.errorHandler());
}

app.listen(SERVER_PORT);
