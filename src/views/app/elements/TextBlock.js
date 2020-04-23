import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';

const TextBlock = (props) => {
  let node = props.node;

  return (
    <div {...props}>
      {node.text}
      {RenderRegistry.renderChildren(node.children, props)}
    </div>
  );
};

RenderRegistry.add({
  textBlock: TextBlock,
});
