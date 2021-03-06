import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { google } from 'googleapis';
import { zonedTimeToUtc } from 'date-fns-tz';
import { subMonths, addMonths } from 'date-fns';
import { router, origin, requireAuth } from '../index';
import pg from '../pg';
import { upsert, execute, getUpsert } from '../util';

const { GOOGLE_CLIENT = '', GOOGLE_SECRET = '' } = process.env;

router.get('/api/event', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const {
    search,
    people,
    page,
    pageSize,
    orderBy = 'parsed_start',
    ...remaining
  } = query;
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

  if (orderBy) {
    pgQuery.orderBy(orderBy, 'desc');
  }

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/event', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id = uuid(), sync } = body;

  if (sync) {
    await syncEvents(user.id);
    res.status(200).send();

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
  const calendarResult = await calendar.calendars.get({
    calendarId: 'primary',
  });

  const now = new Date();
  const timeMin = subMonths(now, 60).toISOString();
  const timeMax = addMonths(now, 12).toISOString();

  const eventResult = await calendar.events.list({
    calendarId: 'primary',
    maxResults: 2000,
    singleEvents: true,
    orderBy: 'startTime',
    timeMin,
    timeMax,
  });

  const timeZone = _.get(calendarResult, 'data.timeZone');
  const events = _.get(eventResult, 'data.items');

  // analyzeEvents(events);

  const eventDocs = _.map(events, ({ id, summary = null, start = null }) => ({
    id: uuid(),
    gcal_id: id,
    summary,
    author_id: userId,
    start,
    parsed_start: zonedTimeToUtc(
      start.dateTime || start.date,
      start.timeZone || timeZone,
    ),
  }));

  const upserts: any[] = [];

  _.each(eventDocs, eventDoc => {
    const pgQuery = getUpsert({ gcal_id: eventDoc.gcal_id }, eventDoc, 'event');

    upserts.push(pgQuery);
  });

  pg.transaction(transaction => {
    _.each(upserts, query => query.transacting(transaction));

    Promise.all(upserts)
      .then(transaction.commit)
      .catch(transaction.rollback);
  });
}

function analyzeEvents(events: any[]) {
  const wordMap: any = {};

  _.each(events, event => {
    const cleanSummary = _.toLower(
      _.replace(event.summary, /[^0-9a-z]/gi, ' '),
    );

    _.each(_.split(cleanSummary, ' '), word => {
      if (word.length > 1) {
        wordMap[word] = wordMap[word] + 1 || 1;
      }
    });
  });

  const wordList = _.map(wordMap, (count, word) => ({ count, word }));
  const sortedWords = _.orderBy(wordList, 'count', 'desc');

  console.log(sortedWords);
}
