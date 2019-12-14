import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Select } from '../../components/Select/Select';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { PersonDoc } from '../../../src-server/models';
import { createDocListSelector } from '../../redux/selectors';

interface SelectPersonProps {
  personDocs?: PersonDoc[];
  loadDocsAction?: Function;
}

function SelectPerson(props: SelectPersonProps & any) {
  const { personDocs, loadDocsAction, ...remainingProps } = props;
  const { result } = useAxiosGet('/api/person', {}, { name: 'SelectPerson' });

  useLoadDocs({ collection: 'person', result, loadDocsAction });

  const personOptions = _.map(personDocs, ({ id, header }) => ({
    label: header,
    value: id,
  }));

  return (
    <Select options={personOptions} isMulti isSearchable {...remainingProps} />
  );
}

export default connect(
  createDocListSelector({
    collection: 'person',
    filter: 'none',
    prop: 'personDocs',
    orderBy: ['position'],
  }),
  { loadDocsAction },
)(SelectPerson);
