import React from 'react';
import merge from 'merge';

const Registry = {
  add: (config) => {
    Object.keys(config).forEach((k) => {
      Registry[k] = config[k];
    });
  },

  get: (type) => {
    let componentInfo = Registry[type];
    if (!componentInfo) {
      return null;
    }

    if (!Registry[`_${type}`]) {
      let resolvedComponentInfo = JSON.parse(JSON.stringify(Registry.object));

      // merge with typeofs
      (componentInfo.typeof || []).forEach(t => {
        let info = Registry[t] || {}
        resolvedComponentInfo = merge.recursive(resolvedComponentInfo, info);
      })
      componentInfo = merge.recursive(resolvedComponentInfo, componentInfo);
      
      // fix attributes
      let componentAttributes = componentInfo.attributes || {};
      let attributes = Object.keys(componentAttributes).map((k) => {
        return {
          name: k,
          ...componentAttributes[k],
        };
      });
      componentInfo.attributes = attributes;

      Registry[`_${type}`] = componentInfo;
    }
    return Registry[`_${type}`];
  }
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
