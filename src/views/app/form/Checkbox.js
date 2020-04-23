import React from 'react';

import { Checkbox, FormControlLabel } from '@material-ui/core';

const CheckboxMemo = React.memo(Checkbox, (prev, next) => {
  return (
    prev.checked === next.checked &&
    prev.label === next.label &&
    prev.description === next.description
  );
});

const StatefulCheckbox = (props) => {
  let fs = props.context;
  let value = fs.getState(props.model) || false;
  const handleChange = () => {
    fs.setState({
      [`${props.model}`]: !value,
    });
  };

  return (
    <div>
      <FormControlLabel
        label={props.label}
        control={
          <CheckboxMemo
            label={props.label}
            checked={value}
            onChange={handleChange}
            value={true}
          />
        }
      />
    </div>
  );
};

export default StatefulCheckbox;
