import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/user', async (req, res) => {
  const { query } = req;
  const { sort } = query;

  let docs;

  if (sort === 'trending') {
    docs = await pg
      .select(pg.raw('ratings.user.id, COUNT(ratings.review.id) as count'))
      .from('ratings.user')
      .leftJoin('ratings.review', 'ratings.review.author_id', 'ratings.user.id')
      .groupBy('ratings.user.id')
      .orderBy('count', 'desc')
      .limit(5);
  } else {
    docs = await pg
      .select('*')
      .from('ratings.user')
      .where(query)
      .limit(10);
  }

  res.status(200).send({ docs });
});

router.post('/api/user', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { onboarding_welcome } = body;

  if (onboarding_welcome) {
    const docs = await pg
      .update({ onboarding_welcome })
      .from('ratings.user')
      .where({ id: user.id })
      .returning('*');

    res.status(200).send({ docs });
  }
});

export async function getFollowers(user: string) {
  const followDocs = await pg
    .select('following')
    .from('ratings.follow')
    .where({ follower: user, deleted: false });

  return _.map(followDocs, 'following');
}
