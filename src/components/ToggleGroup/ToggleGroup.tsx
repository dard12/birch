import React from 'react';
import _ from 'lodash';
import ToggleButton from '../../components/ToggleButton/ToggleButton';

interface ToggleGroupProps {
  allOptions: string[];
  selection: string[];
  setSelection: Function;
}

function ToggleGroup(props: ToggleGroupProps) {
  const { allOptions, selection, setSelection } = props;
  const isChecked = (option: string) => _.includes(selection, option);

  return (
    <React.Fragment>
      {_.map(allOptions, option => {
        const onChange = (event: any) => {
          const { checked } = event.target;

          checked
            ? setSelection([...selection, option])
            : setSelection(_.without(selection, option));
        };

        return (
          <ToggleButton
            checked={isChecked(option)}
            onChange={onChange}
            key={option}
          >
            {option}
          </ToggleButton>
        );
      })}
    </React.Fragment>
  );
}

export default ToggleGroup;
