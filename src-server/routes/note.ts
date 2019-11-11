import { v4 as uuid } from 'uuid';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/note', requireAuth, async (req, res) => {
  const { query, user }: any = req;
  const where = { ...query, author_id: user.id };

  const docs = await pg
    .select('*')
    .from('note')
    .where(where)
    .limit(10);

  res.status(200).send({ docs });
});

router.post('/api/note', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { content, header } = body;
  const id = uuid();
  const author_id = user.id;

  const docs = await pg.raw(
    `
      INSERT INTO note (id, content, header, author_id)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id)
      DO UPDATE
      SET content = ?
      `,
    [id, content, header, author_id, content],
  );

  res.status(200).send({ docs });
});
