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
  const { id = uuid() } = body;
  const update = { ...body, author_id: user.id };

  const docs = await upsert({ id }, update, 'note');

  res.status(200).send({ docs });
});

async function upsert(query: any, updates: any, collection: string) {
  const fullDoc = { ...query, ...updates };
  const queryFields = _.keys(query);
  const updateFields = _.keys(updates);
  const insertFields = _.keys(fullDoc);
  const insertValues = _.map(insertFields, field => fullDoc[field]);
  const updateValues = _.map(updateFields, field => fullDoc[field]);

  const insertString = _.join(insertFields, ', ');
  const valueString = _.join(_.map(insertFields, () => '?'), ', ');
  const queryString = _.join(queryFields, ', ');
  const updateString = _.join(_.map(updateFields, f => `${f} = ?`), ', ');

  const result = await pg.raw(
    `
    INSERT INTO ${collection} (${insertString})
    VALUES (${valueString})
    ON CONFLICT (${queryString})
    DO UPDATE
    SET ${updateString}
    RETURNING *
    `,
    [...insertValues, ...updateValues],
  );

  return _.get(result, 'rows');
}
