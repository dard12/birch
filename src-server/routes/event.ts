import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { upsert, execute } from '../util';

router.get('/api/event', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const { people, page, pageSize, ...remaining } = query;
  const where = { ...remaining, author_id: user.id };

  const pgQuery = pg
    .select('*')
    .from('event')
    .where(where);

  if (!_.isEmpty(people)) {
    pgQuery.whereRaw('people && ?', [people]);
  }

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/event', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id = uuid() } = body;
  const update = { ...body, author_id: user.id };

  const docs = await upsert({ id }, update, 'event');

  res.status(200).send({ docs });
});
