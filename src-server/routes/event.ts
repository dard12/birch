import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { google } from 'googleapis';
import { router, origin, requireAuth } from '../index';
import pg from '../pg';
import { upsert, execute, getUpsert } from '../util';

const { GOOGLE_CLIENT = '', GOOGLE_SECRET = '' } = process.env;

router.get('/api/event', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const { search, people, page, pageSize, ...remaining } = query;
  const where = { ...remaining, author_id: user.id };

  const pgQuery = pg
    .select('*')
    .from('event')
    .where(where);

  if (!_.isEmpty(people)) {
    pgQuery.whereRaw('(people && ?)', [people]);
  }

  if (search) {
    const substringSearch = `%${search}%`;
    pgQuery.whereRaw('(summary ILIKE ?)', [substringSearch]);
  }

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/event', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id = uuid(), sync } = body;

  if (sync) {
    syncEvents(user.id);
    return;
  }

  const update = { ...body, author_id: user.id };

  const docs = await upsert({ id }, update, 'event');

  res.status(200).send({ docs });
});

export async function syncEvents(userId: string) {
  const result = await pg
    .select('google_token')
    .from('user')
    .where({ id: userId });
  const google_token = _.get(result, '[0].google_token');

  if (!google_token) {
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT,
    GOOGLE_SECRET,
    `${origin}/auth/google/callback`,
  );

  oauth2Client.setCredentials({ refresh_token: google_token });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const calendarResult = await calendar.events.list({
    calendarId: 'primary',
    maxResults: 500,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = _.get(calendarResult, 'data.items');

  console.log(_.map(events, 'summary'));

  const eventDocs = _.map(events, ({ id, summary, start }) => ({
    id: uuid(),
    gcal_id: id,
    summary,
    author_id: userId,
    start_date: _.get(start, 'dateTime'),
  }));

  const upserts: any[] = [];

  _.each(eventDocs, eventDoc => {
    const pgQuery = getUpsert(
      { id: eventDoc.id },
      _.omit(eventDoc, 'id'),
      'event',
    );

    upserts.push(pgQuery);
  });

  pg.transaction(transaction => {
    _.each(upserts, query => query.transacting(transaction));

    Promise.all(upserts)
      .then(transaction.commit)
      .catch(transaction.rollback);
  });
}
