import React from 'react';
import {
  AppBar,
  Toolbar,
  Badge,
  Hidden,
  IconButton,
  Button,
} from '@material-ui/core';

import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

function Topbar(props) {
  const ui = useUI();
  const app = useApp();

  // find topbar
  let topbar =
    app.state.children.filter((s) => {
      return s.name === 'topbar';
    })[0] || {};

  return (
    <AppBar position="fixed">
      <Toolbar>topbar</Toolbar>
    </AppBar>
  );
}

export default Topbar;
