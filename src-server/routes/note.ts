import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/note', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const where = { ...query, author_id: user.id };

  const docs = await pg
    .select('*')
    .from('note')
    .where(where)
    .orderBy('position')
    .limit(10);

  res.status(200).send({ docs });
});

router.post('/api/note', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { content = '', header = '', id = uuid() } = body;
  const author_id = user.id;

  const result = await pg.raw(
    `
      INSERT INTO note (id, content, header, author_id)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id)
      DO UPDATE
      SET content = ?
      RETURNING *
      `,
    [id, content, header, author_id, content],
  );

  const docs = _.get(result, 'rows');

  res.status(200).send({ docs });
});
