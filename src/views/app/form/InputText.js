import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';

const TextFieldMemo = React.memo(TextField, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.label === next.label &&
    prev.description === next.description
  );
});

const StatefulTextbox = (props) => {
  let fs = props.context || { model: () => ({}) };
  let m = { ...fs.model(props.model) };
  let desc = props.description;
  if (m.error) {
    desc = m.message;
  }

  return (
    <TextFieldMemo
      fullWidth
      helperText={desc}
      label={props.label}
      margin="dense"
      {...m}
      variant="outlined"
    />
  );
};

RenderRegistry.add({
  inputText: StatefulTextbox,
});
