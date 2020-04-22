import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';

import clsx from 'clsx';

function Container(props) {
  let orientation = props.node.orientation === 'horizontal' ? 'row' : 'column';
  let flex = props.node.flex || (orientation === 'column' ? 1 : null);

  let node = props.node;
  let name = node.name || node.id;

  const renderChildren = RenderRegistry.renderChildren;

  return (
    <div
      {...props}
      className={clsx(props.className, 'node-view')}
      style={{
        flexDirection: orientation,
        flex: flex,
      }}
    >
      {renderChildren(node.children, props)}
    </div>
  );
}

RenderRegistry.add({
  container: Container,
});
