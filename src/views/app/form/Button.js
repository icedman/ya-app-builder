import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import events from 'libs/events';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';

import Btn from '@material-ui/core/Button';

const Button = (props) => {
  let node = props.node;

  const onButtonClick = (evt) => {
    if (node.command) {
      events.$emit(node.command, node);
    }
  };

  let text = node.text || node.name || 'button';

  return (
    <div className={clsx(node.className)} style={{ padding: '2px' }}>
      <Btn
        {...props}
        variant="contained"
        color="primary"
        onClick={onButtonClick}
      >
        {text}
      </Btn>
    </div>
  );
};

RenderRegistry.add({
  button: Button,
});
