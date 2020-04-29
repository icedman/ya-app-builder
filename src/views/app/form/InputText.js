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
  let node = props.node;
  let fs = props.context;

  let m = {};

  if (fs) {
    m = { ...fs.model(`data.${node.dataField || node.name}`) };
  }

  let desc = node.description;
  if (m.error) {
    desc = m.message;
  }

  return (
    <div style={{ flex: 1, margin: '4px' }}>
      <TextField
        fullWidth
        helperText={desc}
        label={node.label}
        margin="dense"
        {...m}
        variant="outlined"
      />
    </div>
  );
};

RenderRegistry.add({
  inputText: StatefulTextbox,
});
