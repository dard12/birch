import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { google } from 'googleapis';
import { Request, Response, Errback } from 'express';
import { v4 as uuid } from 'uuid';
import { UserDoc } from '../models';
import { router, origin, Sentry } from '../index';
import pg from '../pg';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {
  TOKEN_SECRET = '',
  FACEBOOK_CLIENT = '',
  FACEBOOK_SECRET = '',
  GOOGLE_CLIENT = '',
  GOOGLE_SECRET = '',
} = process.env;

export async function hashPassword(password: string) {
  // https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
  const saltRounds = 11;
  return bcrypt.hash(password, saltRounds);
}

const passwordStrategy = new LocalStrategy(async (username, password, done) => {
  let user;

  try {
    user = await pg
      .first('*')
      .from('user')
      .where({ username });
  } catch (error) {
    done(error);
  }

  if (!user) {
    done(null, false);
    return;
  }

  try {
    const verified = await bcrypt.compare(password, _.get(user, 'password'));

    if (verified) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error);
  }
});

// const facebookStrategy = new FacebookStrategy(
//   {
//     clientID: FACEBOOK_CLIENT,
//     clientSecret: FACEBOOK_SECRET,
//     callbackURL: `${origin}/auth/facebook/callback`,
//     // https://developers.facebook.com/docs/facebook-login/permissions#reference-default
//     profileFields: ['id', 'first_name', 'last_name', 'email'],
//     enableProof: true,
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     const { id: facebook_id, name, emails } = profile;
//     const first_name = _.get(name, 'givenName') || '';
//     const last_name = _.get(name, 'familyName') || '';

//     const email = _.first(_.compact(_.map(emails, 'value'))) || '';
//     const id = uuid();

//     try {
//       await pg.raw(
//         `
//         INSERT INTO user (id, facebook_id, first_name, last_name, email, username, created_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//         ON CONFLICT (facebook_id)
//         DO NOTHING
//         `,
//         [id, facebook_id, first_name, last_name, email, id, new Date()],
//       );
//     } catch (error) {
//       // Do nothing
//     }

//     try {
//       await pg
//         .update({ facebook_id })
//         .from('user')
//         .where({ email });

//       const user = await pg
//         .first('*')
//         .from('user')
//         .where({ facebook_id });

//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   },
// );

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT,
    clientSecret: GOOGLE_SECRET,
    callbackURL: `${origin}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id: google_id, name, emails, photos } = profile;
    const first_name = _.get(name, 'givenName') || '';
    const last_name = _.get(name, 'familyName') || '';
    const photo = _.first(_.compact(_.map(photos, 'value'))) || '';
    const email = _.first(_.compact(_.map(emails, 'value'))) || '';
    const id = uuid();

    try {
      await pg.raw(
        `
        INSERT INTO user (id, google_id, first_name, last_name, email, username, photo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (google_id)
        DO NOTHING
      `,
        [id, google_id, first_name, last_name, email, id, photo, new Date()],
      );
    } catch (error) {
      // do nothing
    }

    try {
      await pg
        .update({ google_id, photo, google_token: refreshToken })
        .from('user')
        .where({ email });

      const user = await pg
        .first('*')
        .from('user')
        .where({ google_id });

      listEvents(refreshToken);

      done(undefined, user);
    } catch (error) {
      done(error);
    }
  },
);

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: TOKEN_SECRET,
  },
  async (userPayload, done) => {
    try {
      const { id } = userPayload;

      if (!id) {
        done(null, false);
        return;
      }

      const user = await pg
        .first('*')
        .from('user')
        .where({ id });

      done(null, user);
    } catch (error) {
      done(error);
    }
  },
);

passport.use(passwordStrategy);
// passport.use(facebookStrategy);
passport.use(googleStrategy);
passport.use(jwtStrategy);

passport.serializeUser((user: UserDoc, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await pg
      .first('*')
      .from('user')
      .where({ id });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

function loginUser({
  err,
  user,
  req,
  res,
}: {
  err: Errback | null;
  user: UserDoc;
  req: Request;
  res: Response;
}) {
  if (err || !user) {
    res.status(400).send();
  } else {
    req.login(user, { session: false }, err => {
      if (err) {
        res.status(400).send();
      } else {
        const tokenPayload = _.pick(user, ['id']);
        const token = jwt.sign(tokenPayload, TOKEN_SECRET);

        res.cookie('token', token);
        res.redirect('/login?success=true');
      }
    });
  }
}

router.post('/login', (req, res) => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Errback, user: UserDoc) => loginUser({ err, user, req, res }),
  )(req, res);
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  const user = await pg
    .first('user.id')
    .from('user')
    .where({ username })
    .orWhere({ email });

  if (user) {
    res.status(400).send();
  } else {
    const id = uuid();

    try {
      const hash = await hashPassword(password);

      if (username.match(/[^a-z0-9]/gi)) {
        throw new Error('Invalid Username');
      }

      const users: UserDoc[] = await pg
        .insert({ id, username, email, password: hash, created_at: new Date() })
        .into('user')
        .returning('*');
      const user = _.first(users);

      if (user) {
        loginUser({ err: null, user, req, res });
      } else {
        throw new Error('User Creation Failed');
      }
    } catch (error) {
      res.status(400).send();
      Sentry.captureException({ username, email });
      throw error;
    }
  }
});

router.get('/logout', req => req.logout());

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
);
router.get(
  '/auth/google',
  passport.authenticate('google', {
    accessType: 'offline', // offline get us the refresh token
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  }),
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login?failed=true' }),
  (req, res) => loginUser({ err: null, user: req.user as any, req, res }),
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?failed=true' }),
  (req, res) => loginUser({ err: null, user: req.user as any, req, res }),
);

router.get('/auth/me', async (req, res) => {
  const { cookies } = req;
  const { token } = cookies;

  try {
    if (!token) {
      throw new Error('No token found in cookies.');
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    const id = _.get(decoded, 'id');

    if (!id) {
      throw new Error('No ID found in token.');
    }

    const user = await pg
      .first('*')
      .from('user')
      .where({ id });
    const username = _.get(user, 'username');

    res.json({ token, id, username });
  } catch (error) {
    res.status(401).send();
    Sentry.captureException({ req });
    throw error;
  }
});

async function listEvents(refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT,
    GOOGLE_SECRET,
    `${origin}/auth/google/callback`,
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const result = await calendar.events.list({
    calendarId: 'primary',
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = _.get(result, 'data.items');
  console.log(_.map(events, 'summary'));
}
