import React from 'react';
import merge from 'merge';

const state = {
  depth: 0,
};

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const Registry = {
  _resolved: {},

  add: (config) => {
    Object.keys(config).forEach((k) => {
      let componentInfo = config[k];
      Registry[k] = componentInfo;

      // resolve parent/children
      if (componentInfo.parent && componentInfo.parent.types) {
        componentInfo.parent.types.forEach((p) => {
          Registry[p].children = Registry[p].children || {};
          Registry[p].children.types = Registry[p].children.types || [];
          Registry[p].children.types.push(k);
        });
      }
    });
  },

  _get: (type) => {
    let componentInfo = Registry[type];
    if (!componentInfo) {
      return null;
    }

    // circular reference check
    if (state.depth++ > 20) {
      return componentInfo;
    }

    if (!Registry._resolved[type]) {
      // everything is an object
      let resolvedComponentInfo = cloneObject(Registry.object);

      // merge with typeofs (recursive - inheritance up to root)
      (componentInfo.typeof || []).forEach((t) => {
        let info = cloneObject(Registry._get(t) || {});
        resolvedComponentInfo = merge.recursive(resolvedComponentInfo, info);
      });
      componentInfo = merge.recursive(resolvedComponentInfo, componentInfo);

      // add attributes names
      let componentAttributes = componentInfo.attributes || {};
      Object.keys(componentAttributes).forEach((k) => {
        componentAttributes[k].name = componentAttributes[k].name || k;
      });

      Registry._resolved[type] = componentInfo;
    }
    return Registry._resolved[type];
  },

  get: (type) => {
    state.depth = 0;
    return Registry._get(type);
  },
};

const PreviewRegistry = {
  add: (config) => {
    Object.keys(config).forEach((k) => {
      PreviewRegistry[k] = config[k];
    });
  },
};

const EditorRegistry = {
  add: (config) => {
    Object.keys(config).forEach((k) => {
      EditorRegistry[k] = config[k];
    });
  },
};

export default Registry;
export { EditorRegistry, PreviewRegistry };

// window.$r = Registry;
