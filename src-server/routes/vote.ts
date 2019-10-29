import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/vote', async (req, res) => {
  const { query } = req;

  const result = await pg
    .sum('ratings.vote.vote')
    .from('ratings.vote')
    .where(query);

  res.status(200).send(result);
});

router.post('/api/vote', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const doc = {
    ...body,
    author_id: user.id,
    vote: 1,
  };

  await pg.insert(doc).into('ratings.vote');

  res.status(200).send();
});

router.delete('/api/vote', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const where = {
    ...body,
    author_id: user.id,
  };

  await pg
    .update({ vote: 0 })
    .from('ratings.vote')
    .where(where);

  res.status(200).send();
});
