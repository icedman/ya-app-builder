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

const MenuItem = withRouter((props) => {
  let node = props.node;
  let label = node.label || 'menuItem';

  const onItemClick = (item) => {
    if (item.path) {
      props.history.push(item.path);
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

  return <List>{RenderRegistry.renderChildren(node.children, props)}</List>;
};

RenderRegistry.add({
  menu: Menu,
  menuItem: MenuItem,
});
