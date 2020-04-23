import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const keyboardButtonProps = { 'aria-label': 'change date' };

const DatePickerMemo = React.memo(KeyboardDatePicker, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.label === next.label &&
    prev.description === next.description
  );
});

const StatefulKeyboardDatePicker = (props) => {
  const fs = props.context;

  const handleChange = (value) => {
    if (fs) {
      fs.setState({
        [`${props.model}`]: value,
      });
    }
  };

  let value = props.value || null;
  if (fs) {
    value = fs.getState(props.model);
  }

  return (
    <DatePickerMemo
      // variant="inline"
      format="MM/dd/yyyy"
      {...props}
      // disableToolbar
      label={props.label || ' '}
      value={value}
      onChange={handleChange}
    />
  );
};

export default StatefulKeyboardDatePicker;
