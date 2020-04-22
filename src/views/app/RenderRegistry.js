import React from 'react';
import merge from 'merge';

function Render(props) {
  let node = props.node;
  let Component =
    RenderRegistry[node.component] ||
    RenderRegistry[node.type] ||
    ((props) => <div>Unhandled: {node.type}</div>);
  return <Component {...props} />;
}

function renderChildren(children, props) {
  return (children || []).map((node, idx) => {
    return <Render {...props} className="" node={node} key={`cp-${idx}`} />;
  });
}

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const RenderRegistry = {
  Render,
  renderChildren,

  add: (config) => {
    Object.keys(config).forEach((k) => {
      let componentInfo = config[k];
      RenderRegistry[k] = componentInfo;
    });
  },

  get: (type) => {
    return RenderRegistry[type];
  },
};

export default RenderRegistry;
