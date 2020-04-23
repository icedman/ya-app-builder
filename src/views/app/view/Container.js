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
      className={clsx(props.className)}
      style={{
        display: 'flex',
        flexDirection: orientation,
        flex: flex,
      }}
    >
      {renderChildren(node.children, props)}
    </div>
  );
}

function SubView(props) {
  const app = useApp();

  let node = props.node;

  let subView;
  let project = app.state;

  (project.children || []).forEach((c) => {
    if (c.type === 'view' && c.id === node.view) {
      subView = c;
    }
  });

  if (subView) {
    return <RenderRegistry.Render node={subView} />;
  }

  return <div>missing subview {node.view}</div>;
}

RenderRegistry.add({
  container: Container,
  subView: SubView,
  view: Container,
});
