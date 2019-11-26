import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { upsert } from '../util';

router.get('/api/reminder_item', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const { sort, ...filters } = query;
  const where = { ...filters, author_id: user.id };

  const pgQuery = pg
    .select('*')
    .from('reminder_item')
    .where(where);

  let docs;

  if (sort === 'random') {
    const random = _.random(1, true);

    docs = await pgQuery
      .clone()
      .whereRaw('(random > ?)', [random])
      // .leftJoin('reminder', 'reminder_id', 'id')
      .limit(1);

    if (_.isEmpty(docs)) {
      docs = await pgQuery
        .clone()
        .whereRaw('(random <= ?)', [random])
        // .leftJoin('reminder', 'reminder_id', 'id')
        .limit(1);
    }
  } else {
    docs = await pgQuery;
  }

  res.status(200).send({ docs });
});

router.post('/api/reminder_item', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id = uuid() } = body;
  const update = { ...body, author_id: user.id };

  const docs = await upsert({ id }, update, 'reminder_item');

  res.status(200).send({ docs });
});
