import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { subDays } from 'date-fns';
import { router, requireAuth } from '..';
import pg from '../pg';
import execute from '../execute';
import { getFollowers } from './user';

router.get('/api/review', async (req, res, next) => {
  const { query } = req;
  const {
    exclude,
    follow,
    follower,
    created_at,
    sort = 'ratings.review.created_at',
  } = query;

  const where = _.omit(query, [
    'exclude',
    'follow',
    'created_at',
    'sort',
    'follower',
    'page',
    'pageSize',
  ]);
  const pgQuery = pg.from('ratings.review').where(where);

  if (exclude) {
    pgQuery.whereNot('ratings.review.author_id', exclude);
  }

  if (follow && follower) {
    const followingIds = await getFollowers(follower);

    if (follow === 'true') {
      pgQuery.whereIn('ratings.review.author_id', followingIds);
    } else if (follow === 'false') {
      pgQuery.whereNotIn('ratings.review.author_id', [
        follower,
        ...followingIds,
      ]);
    }
  }

  if (created_at === 'recent') {
    const last6Months = subDays(new Date(), 30 * 6);
    pgQuery.whereRaw('ratings.review.created_at > ?', [last6Months]);
  }

  pgQuery
    .select(pg.raw('ratings.review.*, SUM(ratings.vote.vote) as vote'))
    .leftJoin('ratings.vote', 'ratings.vote.review_id', 'ratings.review.id')
    .groupBy('ratings.review.id');

  if (sort === 'vote') {
    pgQuery.orderByRaw('vote DESC NULLS LAST, ratings.review.created_at DESC');
  } else {
    pgQuery.orderBy(sort, 'desc');
  }

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/review', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { target_gid, content: rawContent, rating, type } = body;
  const content = rawContent || '';
  const author_id = user.id;

  const now = new Date();
  await pg.raw(
    `
      INSERT INTO ratings.review (id, author_id, target_gid, created_at, updated_at, content, rating, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT ON CONSTRAINT review_author_id_target_gid_key
      DO UPDATE SET content = ?, rating = ?, updated_at = ?
      `,
    [
      uuid(),
      author_id,
      target_gid,
      now,
      now,
      content,
      rating,
      type,
      content,
      rating,
      now,
    ],
  );

  res.status(200).send();

  updateAverage(target_gid, type);
});

router.delete('/api/review', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { target_gid, type } = body;
  const author_id = user.id;
  const where = {
    target_gid,
    author_id,
  };

  await pg
    .delete()
    .from('ratings.review')
    .where(where);

  res.status(200).send();

  updateAverage(target_gid, type);
});

async function updateAverage(
  target_gid: string,
  type: 'recording' | 'release_group',
) {
  const result = await pg
    .select(
      pg.raw(
        `
          AVG(ratings.review.rating) as avg,
          COUNT(ratings.review.id) as count
        `,
      ),
    )
    .from('ratings.review')
    .where({ target_gid });

  const table =
    type === 'recording' ? 'ratings.recording' : 'ratings.release_group';
  const targetDoc = await pg
    .first('musicbrainz_rating')
    .from(table)
    .where({ gid: target_gid });
  const musicbrainz_rating = _.get(targetDoc, 'musicbrainz_rating') / 20 || 0;
  const musicbrainz_weight = musicbrainz_rating ? 5 : 0;
  const rawAvg = _.toNumber(_.get(result, '[0].avg'));
  const rawCount = _.toNumber(_.get(result, '[0].count'));
  const count = rawCount + musicbrainz_weight;
  const avg =
    rawAvg * (rawCount / count) +
    musicbrainz_rating * (musicbrainz_weight / count);

  const numberDummies = 10;
  const dummyScore = 3;
  const adjustedAvg =
    (avg + dummyScore * numberDummies) / (count + numberDummies);

  await pg.raw(
    `
      INSERT INTO ratings.avg_rating (target_gid, rating, adjusted_rating, count)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (target_gid)
      DO UPDATE SET rating = ?, count = ?, adjusted_rating = ?
      `,
    [target_gid, avg, adjustedAvg, count, avg, count, adjustedAvg],
  );

  await pg
    .update({ rating: avg, adjusted_rating: adjustedAvg })
    .from(table)
    .whereRaw(
      `
      (
        gid = ?
      )
      `,
      [target_gid],
    );
}
