import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { upsert, softDelete } from '../util';

router.get('/api/reminder_item', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const { sort, ...filters } = query;
  const where = { ...filters, 'reminder_item.author_id': user.id };

  const pgQuery = pg
    .select('*')
    .from('reminder_item')
    .where(where);

  let docs;

  if (sort === 'last_seen') {
    docs = await pgQuery
      .select('reminder_item.*', 'reminder.header')
      .leftJoin('reminder', 'reminder_id', 'reminder.id')
      .orderBy('reminder_item.last_seen', 'asc')
      .where({ deleted: false })
      .limit(5);

    docs = docs.length === 5 ? _.shuffle(docs) : docs;
    docs = _.take(docs, 1);

    const id = _.get(docs, '[0].id');

    if (id) {
      await pg
        .update({ last_seen: new Date() })
        .from('reminder_item')
        .where({ id });
    }
  } else {
    docs = await pgQuery.select('*');
  }

  res.status(200).send({ docs });
});

router.post('/api/reminder_item', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id = uuid() } = body;
  const update = { ...body, author_id: user.id, last_seen: new Date() };

  const docs = await upsert({ id }, update, 'reminder_item');

  res.status(200).send({ docs });
});

router.delete('/api/reminder_item', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const where = {
    ...body,
    author_id: user.id,
    deleted: false,
  };

  const docs = await softDelete(where, 'reminder_item');

  res.status(200).send({ docs });
});
