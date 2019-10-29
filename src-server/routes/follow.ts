import { router, requireAuth } from '..';
import pg from '../pg';
import _ from 'lodash';
import execute from '../execute';

router.get('/api/follow', async (req, res) => {
  const { query } = req;
  const where = {
    ..._.omit(query, ['page', 'pageSize', 'count']),
    deleted: false,
  };

  let result;

  if (query.count) {
    result = await pg
      .count('*')
      .from('ratings.follow')
      .where(where);
  } else {
    const pgQuery = pg
      .select('*')
      .from('ratings.follow')
      .where(where)
      .orderBy('created_at', 'desc');

    result = await execute(pgQuery, query);
  }

  res.status(200).send(result);
});

router.post('/api/follow', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const followDoc = {
    ...body,
    follower: user.id,
    created_at: new Date(),
    deleted: false,
  };

  await pg.insert(followDoc).into('ratings.follow');

  res.status(200).send();
});

router.delete('/api/follow', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const where = {
    ...body,
    follower: user.id,
    deleted: false,
  };

  const deleted_at = new Date();
  await pg
    .update({ deleted: true, deleted_at })
    .from('ratings.follow')
    .where(where);

  res.status(200).send();
});
