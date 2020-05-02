import React from 'react';

import { Link as RouterLink, withRouter } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Badge,
  Hidden,
  IconButton,
  Button,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';
import clsx from 'clsx';

import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Icon from 'components/icons/Icon';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexGrowMore: {
    flexGrow: 10,
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
}));

const Topbar = withRouter((props) => {
  const ui = useUI();
  const app = useApp();

  const { className, onSidebarOpen, ...rest } = props;
  const classes = useStyles();

  // find topbar
  let topbar =
    (app.state.children || []).filter((s) => {
      return s.name === 'topbar';
    })[0] || {};

  const actions = ui.state.topbar.items.map((item, idx) => {
    let icon = item.icon ? <Icon icon={item.icon} /> : '';
    return (
      <Button color="inherit" key={idx} onClick={item.action}>
        {icon}
        {item.label && <span>{item.label}</span>}
      </Button>
    );
  });

  return (
    <AppBar className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/">
          <img alt="Logo" src="./logo192.png" style={{ height: '40px' }} />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          {actions}
          <div className={classes.flexGrowMore} />
          {/*
          <IconButton color="inherit">
            <Badge badgeContent={2} color="primary" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        */}
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={() => {}}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
});

export default Topbar;
