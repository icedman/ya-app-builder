import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from './RenderRegistry';
import { withRouter } from 'react-router-dom';

const Page = (props) => {
  let node = props.node;

  return (
    <div>
      PAGE
      {RenderRegistry.renderChildren(node.children, props)}
    </div>
  );
};

RenderRegistry.add({
  page: Page,
});
