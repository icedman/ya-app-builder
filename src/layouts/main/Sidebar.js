import React from 'react';
import { withRouter } from 'react-router-dom';
import { Divider, Drawer } from '@material-ui/core';

import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import RenderRegistry from 'views/app/RenderRegistry';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)',
    },
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
}));

function Sidebar(props) {
  const ui = useUI();
  const app = useApp();

  const { open, variant, onClose, className, ...rest } = props;
  const classes = useStyles();

  // find sidebar
  let sidebar = {
    ...((app.state.children || []).filter((s) => {
      return s.name === 'sidebar';
    })[0] || {}),
  };

  // console.log(app.state);

  sidebar.children = [...(sidebar.children || [])];
  sidebar.children.push({
    label: 'Back to Editor',
    path: '/editor',
    type: 'menuItem',
  });

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div style={{ width: props.sidebarWidth }}>
        <RenderRegistry.Render node={sidebar} />
      </div>
    </Drawer>
  );
}

export default Sidebar;
