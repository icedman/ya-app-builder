import React from 'react';
import merge from 'merge';

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const RenderRegistry = {
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

// window.$rr = RenderRegistry;
