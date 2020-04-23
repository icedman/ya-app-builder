import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';

const Header = (props) => {
  let node = props.node;

  return (
    <div {...props}>
      <h2>{node.text}</h2>
      {RenderRegistry.renderChildren(node.children, props)}
    </div>
  );
};

RenderRegistry.add({
  header: Header,
});
