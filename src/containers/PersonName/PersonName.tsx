import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { PersonDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';

interface PersonNameProps {
  person: string;
  personDoc?: PersonDoc;
  loadDocsAction?: Function;
}

function PersonName(props: PersonNameProps) {
  const { person, personDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/person',
    { id: person },
    {
      name: 'PersonName',
      cachedResult: personDoc,
    },
  );

  useLoadDocs({ collection: 'person', result, loadDocsAction });

  if (!personDoc) {
    return null;
  }

  const { header } = personDoc;

  return <React.Fragment>{header}</React.Fragment>;
}

export default connect(
  createDocSelector({
    collection: 'person',
    id: 'person',
    prop: 'personDoc',
  }),
  { loadDocsAction },
)(PersonName);
