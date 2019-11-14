import { createSelector } from 'redux-starter-kit';
import _ from 'lodash';

export const userSelector = createSelector(
  state => _.get(state, 'login.id'),
  user => ({ user }),
);
export const usernameSelector = createSelector(
  state => _.get(state, 'login.username'),
  username => ({ username }),
);

export const createCollectionSelector = (collectionName: string) => {
  return createSelector(
    state => _.get(state, `collections.${collectionName}`),
    collection => ({ [collectionName]: collection }),
  );
};

export const createDocSelector = ({
  collection,
  id,
  prop,
}: {
  collection: string;
  id: string;
  prop: string;
}) => {
  return createSelector(
    [
      createCollectionSelector(collection),
      (state: any, props: any) => props[id],
    ],
    (collections, docId) => ({
      [prop]: _.get(collections[collection], docId),
    }),
  );
};

export const createDocListSelector = ({
  collection,
  filter,
  prop,
  orderBy,
}: {
  collection: string;
  filter: string;
  prop: string;
  orderBy?: any[];
}): any => {
  return createSelector(
    [
      createCollectionSelector(collection),
      (state: any, props: any) => props[filter],
    ],
    (collections, filterObj) => {
      const collectionDict = collections[collection];
      let docList = _.filter(collectionDict, filterObj);

      if (orderBy) {
        docList = _.orderBy(docList, ...orderBy);
      }

      return { [prop]: docList };
    },
  );
};
