import { QueryBuilder } from 'knex';
import _ from 'lodash';
import pg from './pg';

export async function execute(pgQuery: QueryBuilder, options?: any) {
  const page = _.toNumber(_.get(options, 'page')) || 0;
  const pageSize = _.toNumber(_.get(options, 'pageSize')) || 5;
  const tempDocs = await pgQuery
    .clone()
    .limit(pageSize + 1)
    .offset(pageSize * page);

  const next = _.size(tempDocs) > pageSize ? page + 1 : null;
  const docs = _.take(tempDocs, pageSize);

  return { docs, page, next };
}

export function getUpsert(query: any, updates: any, collection: string) {
  const fullDoc = { ...query, ...updates };
  const queryFields = _.keys(query);
  const updateFields = _.keys(_.omit(updates, [...queryFields, 'id']));
  const insertFields = _.keys(fullDoc);
  const insertValues = _.map(insertFields, field => fullDoc[field]);
  const updateValues = _.map(updateFields, field => fullDoc[field]);

  const insertString = _.join(insertFields, ', ');
  const valueString = _.join(_.map(insertFields, () => '?'), ', ');
  const queryString = _.join(queryFields, ', ');
  const updateString = _.join(_.map(updateFields, f => `${f} = ?`), ', ');

  return pg.raw(
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
}

export async function upsert(query: any, updates: any, collection: string) {
  const result = await getUpsert(query, updates, collection);

  return _.get(result, 'rows');
}

export function softDelete(query: any, collection: string) {
  const deleted_at = new Date();

  return pg
    .update({ deleted: true, deleted_at })
    .from(collection)
    .where(query)
    .returning('*');
}
