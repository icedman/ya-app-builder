import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import { findById } from 'libs/utility';

import clsx from 'clsx';

function Container(props) {
  const app = useApp();
  let node = props.node;

  let orientation = node.orientation === 'horizontal' ? 'row' : 'column';
  let flex = node.flex || (orientation === 'column' ? 1 : null);

  // let _props = { ... props.staticContext, staticContext: null };
  // delete _props.staticContext;

  return (
    <React.Fragment>
      <div
        {...props}
        className={clsx(props.className)}
        style={{
          display: 'flex',
          flexDirection: orientation,
          flex: flex,
        }}
      >
        {RenderRegistry.renderChildren(node.children, {
          ...props,
        })}
      </div>
    </React.Fragment>
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
    return <RenderRegistry.Render node={subView} context={props.context} />;
  }

  return <div>missing subview {node.view}</div>;
}

RenderRegistry.add({
  container: Container,
  subView: SubView,
  view: Container,
});
