import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  colors,
  Collapse,
} from '@material-ui/core';

const menuItemDelay = 350; // to allow animation to play

const MenuItem = withRouter((props) => {
  let node = props.node;
  let label = node.label || 'menuItem';

  const onItemClick = (item) => {
    if (item.path) {
      setTimeout(() => {
        props.history.push(item.path);
      }, menuItemDelay);
    }
  };

  return (
    <ListItem
      // className={classes.item}
      disableGutters
      // key={page.title}
      button
      // selected={page.uuid === selectedState}
      onClick={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        onItemClick(node);
      }}
    >
      <ListItemText>{label}</ListItemText>
    </ListItem>
  );
});

const Menu = (props) => {
  const onItemClick = (item) => {
    console.log(item);
  };

  let node = props.node;

  return (
    <List {...props}>
      {RenderRegistry.renderChildren(node.children, props)}
    </List>
  );
};

RenderRegistry.add({
  menu: Menu,
  menuItem: MenuItem,
});
