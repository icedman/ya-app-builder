import React from 'react';

import Registry, { PreviewRegistry } from '../Registry';

const Project = (props) => {
  const onSave = () => {
    props.context.save();
  };

  const onLoad = () => {
    props.context.load();
  };

  const state = props.context.getState('root');
  let name = state.name || 'The Project';
  let description = state.description;

  return (
    <div>
      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">{name}</h1>
            <h2 className="subtitle">{description}</h2>
          </div>
        </div>
      </section>

      <section className="section"></section>

      <section className="section">
        <div className="buttons">
          <button className="button" onClick={onSave}>
            Save
          </button>
          <button className="button" onClick={onLoad}>
            Load
          </button>
        </div>
      </section>

      <div className="has-background-white">
        <pre>{JSON.stringify(state, null, 4)}</pre>
      </div>
    </div>
  );
};

Registry.add({
  project: {
    children: {
      showInTree: false,
      types: ['view', 'model'],
    },
    attributes: {
      description: {
        type: 'text',
      },
      server: {
        section: 'endpoints',
        type: 'string',
        description: 'app builder server',
      },
      assets: {
        section: 'endpoints',
        type: 'string',
        description: 'assets path',
      },
    },
    preview: 'Project',
  },
});

PreviewRegistry.add({
  Project,
});
