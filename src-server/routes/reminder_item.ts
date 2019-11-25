import { v4 as uuid } from 'uuid';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { upsert } from '../util';

router.get('/api/reminder_item', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const where = { ...query, author_id: user.id };

  const docs = await pg
    .select('*')
    .from('reminder_item')
    .where(where);

  res.status(200).send({ docs });
});

router.post('/api/reminder_item', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id = uuid() } = body;
  const update = { ...body, author_id: user.id };

  const docs = await upsert({ id }, update, 'reminder_item');

  res.status(200).send({ docs });
});
