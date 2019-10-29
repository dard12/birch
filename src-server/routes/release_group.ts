import { router } from '..';
import execute from '../execute';
import { handleFilters, fastSearch } from './recording';
import { best2019Recordings, best2019RapRecordings } from '../constants';
import _ from 'lodash';

router.get('/api/release_group', async (req, res) => {
  const { query } = req;
  const { search, id, gid, sort } = query;
  const { pgQuery, where } = await handleFilters('release_group', query);

  let result;

  if (search) {
    result = await execute(fastSearch(pgQuery, search), query);
  } else if (id || gid) {
    result = await execute(pgQuery.select('*').where(where), query);
  } else if (sort === 'chart') {
    result = {
      docs: await pgQuery
        .select('*')
        .whereRaw('(musicbrainz_rating > 85)')
        .where(where)
        .orderByRaw('musicbrainz_count DESC NULLS LAST')
        .limit(10),
    };
  } else if (sort === 'chart-2019') {
    const docs = await pgQuery.select('*').whereIn('id', best2019Recordings);

    result = {
      docs: _.map(best2019Recordings, recording =>
        _.find(docs, doc => doc.id === recording),
      ),
    };
  } else if (sort === 'chart-rap-2019') {
    const docs = await pgQuery.select('*').whereIn('id', best2019RapRecordings);

    result = {
      docs: _.map(best2019RapRecordings, recording =>
        _.find(docs, doc => doc.id === recording),
      ),
    };
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
