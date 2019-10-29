import { router } from '..';
import pg from '../pg';
import _ from 'lodash';
import { subDays } from 'date-fns';
import { genreToTags } from '../constants';
import execute from '../execute';
import { QueryBuilder } from 'knex';
import { getFollowers } from './user';
import { RecordingDoc, ReleaseGroupDoc } from '../models';

router.get('/api/recording', async (req, res) => {
  const { query } = req;
  const {
    search,
    sort,
    gid,
    id,
    recording_ids,
    users,
    user,
    similar,
    type,
  } = query;

  if (!_.isEmpty(users) && !user) {
    res.status(200).send({ docs: [] });
    return;
  }

  const { pgQuery, where } = await handleFilters('recording', query);

  let result;

  if (sort === 'trending') {
    result = { docs: await trendingRecordings() };
  } else if (similar && type) {
    await filterSimilar(pgQuery, similar, type);
    result = await execute(pgQuery, query);
  } else if (search) {
    result = await execute(fastSearch(pgQuery, search), query);
  } else if (gid || id || recording_ids) {
    result = { docs: await pgQuery.select('*').where(where) };
  } else {
    result = await execute(
      pgQuery
        .select('*')
        .where(where)
        .orderByRaw(
          `
            adjusted_rating DESC NULLS LAST,
            musicbrainz_rating DESC NULLS LAST
          `,
        ),
      query,
    );
  }

  res.status(200).send(result);
});

export function fastSearch(pgQuery: QueryBuilder, search: string) {
  const substringSearch = `%${search}%`;

  return pgQuery
    .clone()
    .select(
      pg.raw(
        `
        *,
        name ILIKE ?
        OR artist_name ILIKE ? as match,  
    
        coalesce(similarity(name, ?), 0)
        + coalesce(similarity(artist_name, ?), 0) as rank
        `,
        [substringSearch, substringSearch, search, search],
      ),
    )
    .whereRaw(
      `
      (
        tsv @@ plainto_tsquery('english', ?)
        OR name ILIKE ?
        OR artist_name ILIKE ?
      )
      `,
      [search, substringSearch, substringSearch],
    )
    .orderByRaw(
      `
      match DESC NULLS LAST,
      adjusted_rating DESC NULLS LAST,
      rank DESC
      `,
    );
}

export async function handleFilters(
  type: 'recording' | 'release_group',
  query: any,
) {
  const pgQuery = pg.from(`ratings.${type}`);
  const specialOptions = ['search', 'sort', 'page', 'pageSize'];
  const remainingQuery: any = _.omit(query, specialOptions);

  const {
    recording_ids,
    release_date_year,
    language_name,
    genres,
    users,
    user,
    random,
    randomDirection,
    ...where
  } = remainingQuery;

  if (random) {
    pgQuery.whereRaw(`(random ${randomDirection} ?)`, [_.toNumber(random)]);
  }

  if (recording_ids) {
    pgQuery.whereIn('id', recording_ids);
  }

  if (release_date_year) {
    const [start, end] = release_date_year;
    filterReleaseYear(pgQuery, start, end);
  }

  filterLanguage(pgQuery, language_name);

  if (genres) {
    const tagIds = _.flatten(_.map(genres, genre => genreToTags[genre]));
    filterTags(pgQuery, tagIds);
  }

  if (user && users) {
    const followerIds = await getFollowers(user);

    pgQuery
      .leftJoin(
        'ratings.review',
        'ratings.review.target_gid',
        'ratings.recording.gid',
      )
      .whereIn('ratings.review.author_id', followerIds)
      .where({ 'ratings.review.rating': 5 });
  }

  return { pgQuery, where };
}

export async function filterSimilar(
  pgQuery: QueryBuilder,
  similar: number,
  type: string,
) {
  const doc = ((await pg
    .first('*')
    .from(`ratings.${type}`)
    .where({ id: similar })) as any) as RecordingDoc | ReleaseGroupDoc;

  const { language_name, release_date_year, tag_ids = [] } = doc;

  const start = release_date_year
    ? _.toString(release_date_year - 5)
    : undefined;
  const end = release_date_year ? _.toString(release_date_year + 5) : undefined;

  filterLanguage(pgQuery, language_name);
  filterReleaseYear(pgQuery, start, end);
  filterTags(pgQuery, tag_ids);

  pgQuery.select('*');
  pgQuery.whereRaw('(adjusted_rating > ? OR musicbrainz_rating > ?)', [3, 3]);
}

function filterReleaseYear(
  pgQuery: QueryBuilder,
  rawStart?: any,
  rawEnd?: any,
) {
  const start = _.toNumber(rawStart);
  const end = _.toNumber(rawEnd);
  const isUnbounded = start === 1950 && end === 2019;

  if (start && end && !isUnbounded) {
    pgQuery.whereRaw(
      `
      (
        (release_date_year BETWEEN ? AND ?) OR (release_date_year IS NULL)
      )
      `,
      [start, end],
    );
  }
}

function filterLanguage(
  pgQuery: QueryBuilder,
  language_name?: string | string[],
) {
  const languageArray = _.isArray(language_name)
    ? language_name
    : [language_name];

  if (language_name && !_.isEmpty(languageArray)) {
    pgQuery.whereIn('language_name', languageArray);
  }
}

function filterTags(pgQuery: QueryBuilder, tagIds?: number[]) {
  if (tagIds && !_.isEmpty(tagIds)) {
    pgQuery.whereRaw(
      `
        (tag_ids && ?)
      `,
      [tagIds],
    );
  }
}

async function trendingRecordings() {
  const last6Months = subDays(new Date(), 30 * 6);
  const trendingReviews = await pg
    .select(
      pg.raw(
        'ratings.review.target_gid, COUNT(ratings.review.target_gid) as count',
      ),
    )
    .from('ratings.review')
    .whereRaw(
      `
    (
      ratings.review.rating = 5
      AND ratings.review.created_at > ?  
      AND ratings.review.type = 'recording'
    )
    `,
      [last6Months],
    )
    .groupBy('ratings.review.target_gid')
    .orderBy('count', 'desc')
    .limit(5);

  const trendingGids = _.map(trendingReviews, 'target_gid');

  return pg
    .select('*')
    .from('ratings.recording')
    .whereIn('gid', trendingGids);
}
