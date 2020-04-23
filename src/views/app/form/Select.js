import React, { Fragment } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
  },
}));

const SelectMemo = React.memo(Select, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.optionscount === next.optionscount &&
    prev.label === next.label &&
    prev.description === next.description
  );
});

const StatefulSelect = (props) => {
  console.log(props.model);
  let classes = useStyles();
  let fs = props.context;
  let options = props.options || [];
  return (
    <FormControl className={classes.formControl}>
      {options.length > 0 && (
        <Fragment>
          <InputLabel id={props.model}>{props.label}</InputLabel>
          <SelectMemo
            labelId={props.model}
            id={props.model}
            optionscount={options.length}
            {...fs.model(props.model)}
          >
            {options.map((option) => {
              if (typeof option === 'string') {
                option = {
                  label: option,
                  value: option,
                };
              }
              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              );
            })}
          </SelectMemo>
        </Fragment>
      )}
    </FormControl>
  );
};

export default StatefulSelect;
