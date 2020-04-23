import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import { findById } from 'libs/utility';

import StateHelper from 'libs/stateHelper';

const Page = (props) => {
  const app = useApp();

  let node = findById(app.state, props.node.id, { key: 'id' }) || {};

  return (
    <div>
      {RenderRegistry.renderChildren(node.children, {
        ...props,
      })}
    </div>
  );
};

RenderRegistry.add({
  page: Page,
});
