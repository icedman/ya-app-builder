import React from 'react';

const Registry = {
  add: (config) => {
    Object.keys(config).forEach((k) => {
      Registry[k] = config[k];
    });
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
