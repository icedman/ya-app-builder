import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import { withRouter } from 'react-router-dom';

import { useApp } from 'stores/AppStore';

const Project = withRouter((props) => {
  const app = useApp();

  /*
  const onSave = () => {
    props.context.save();
  };

  const onLoad = () => {
    props.context.load();
  };

  const onRun = () => {
    let state = props.context.state();
    
    app.dispatch(
      app.regenerateRoutes(state)
    );

    setTimeout(() => {
      props.history.push('/app');
    }, 0);
  };
  */

  const state = props.context.state();
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

      {/*
      <section className="section">
        <div className="buttons">
          <button className="button" onClick={onSave}>
            Save
          </button>
          <button className="button" onClick={onLoad}>
            Load
          </button>

          <a className="button is-danger" onClick={onRun}>
            Run
          </a>
        </div>
      </section>
      */}

      <div className="has-background-white">
        <pre>{JSON.stringify(state, null, 4)}</pre>
      </div>
    </div>
  );
});

Registry.add({
  project: {
    children: {
      showInTree: false,
      types: ['page', 'view', 'menu', 'model'],
    },
    attributes: {
      description: {
        type: 'text',
      },
      server: {
        section: 'endpoints',
        type: 'string',
        description: 'app server',
      },
      startup: {
        section: 'content',
        type: 'text',
        description: 'startup page',
        edit: 'pageUrl',
      },
    },
    preview: 'Project',
  },
});

PreviewRegistry.add({
  Project,
});
