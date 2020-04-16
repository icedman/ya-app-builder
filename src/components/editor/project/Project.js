import React from 'react';

import Registry, { PreviewRegistry } from '../Registry';

const Project = (props) => {

  const onSave = () => {
    props.context.save();
  }

  const onLoad = () => {
    props.context.load();
  }

  const state = props.context.getState('root');

  return <div>

<section className="hero is-light">
  <div className="hero-body">
    <div className="container">
      <h1 className="title">
        The Project
      </h1>
      <h2 className="subtitle">
        {state.name}
      </h2>
    </div>
  </div>
</section>

<section className="section">

    <button className='button' onClick={onSave}>Save</button>
    <button className='button' onClick={onLoad}>Load</button>

</section>

          <div className="has-background-white">
            <pre>{JSON.stringify(state, null, 4)}</pre>
          </div>

  </div>
}

Registry.add({
  project: {
    children: {
      showInTree: false,
      types: ['view', 'model'],
    },
    preview: 'Project',
  },
});

PreviewRegistry.add({
  Project
});
