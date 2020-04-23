import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';

import Btn from '@material-ui/core/Button';

const Button = (props) => {
  let node = props.node;

  return (
    <Btn {...props} variant="contained" color="primary">
      {node.text}
    </Btn>
  );
};

RenderRegistry.add({
  button: Button,
});
