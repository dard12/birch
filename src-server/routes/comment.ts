import { router, requireAuth } from '..';
import pg from '../pg';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import execute from '../execute';

router.get('/api/comment', async (req, res) => {
  const { query } = req;
  const { distinct } = query;
  const where = {
    ..._.omit(query, ['page', 'pageSize', 'distinct']),
    deleted: false,
  };

  const pgQuery = pg.from('ratings.comment').where(where);
  let result;

  if (distinct) {
    pgQuery
      .select(
        pg.raw(
          `
          (array_agg(id ORDER BY created_at DESC))[1] as id,
          MAX(created_at) as created_at
          `,
        ),
      )
      .groupBy('target_gid')
      .orderByRaw('created_at DESC');

    const commentResult = await execute(pgQuery, query);
    const commentIds = _.map(commentResult.docs, 'id');

    const docs = await pg
      .select('*')
      .from('ratings.comment')
      .whereIn('id', commentIds)
      .orderByRaw('created_at DESC');

    result = { ...commentResult, docs };
  } else {
    pgQuery.select('*').orderByRaw('created_at DESC');
    result = await execute(pgQuery, query);
  }

  res.status(200).send(result);
});

router.post('/api/comment', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const commentDoc = {
    ...body,
    id: uuid(),
    author_id: user.id,
    created_at: new Date(),
    deleted: false,
  };

  await pg.insert(commentDoc).into('ratings.comment');

  res.status(200).send();
});
