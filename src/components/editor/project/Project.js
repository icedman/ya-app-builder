import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import { withRouter } from 'react-router-dom';
import crud from 'libs/crud';
import StateHelper from 'libs/stateHelper';
import { guid } from 'libs/utility';

import { useUI } from 'stores/UIStore';

const fsUI = new StateHelper();

const Project = withRouter((props) => {
  const [apps, setApps] = React.useState([]);
  const ui = useUI();
  const cs = crud('apps');

  fsUI.useContext(ui, ui.setState);

  const loadApps = () => {
    cs.find({})
      .then((res) => {
        setApps(res.data);
      })
      .catch((err) => {});

    console.log('apps loaded');
  };

  React.useEffect(() => {
    loadApps();
  }, []);

  const onNewProject = () => {
    // new project

    let keys = Object.keys(props.context.state());
    let newId = guid();

    // console.log(keys);
    // console.log(newId);
    // console.log(props.context.state());

    props.context.setState({
      $unset: keys,
      id: newId,
      type: 'project',
      server: 'localhost:1337',
      children: [],
    });

    fsUI.setState({
      '_state.selected': {
        id: newId,
        type: 'project',
      },
      '_state.drag': null,
      '_state.dragOver': null,
    });
  };

  const onLoadItem = async (item) => {
    let itemId = item.id || item._id;
    let state = props.context.state();

    let res = await cs.findOne(itemId);

    let data = res.data;
    let newState = data.definition || {};

    console.log(newState);

    props.context.setState({
      ...newState,
      _id: itemId,
      id: itemId,
    });

    fsUI.setState({
      '_state.selected': {
        id: null,
        type: 'project',
      },
      '_state.drag': null,
      '_state.dragOver': null,
    });

    setTimeout(() => {
      fsUI.setState({
        '_state.selected': {
          id: itemId,
          type: 'project',
        },
      });
    }, 10);
  };

  const onSave = async () => {
    let state = props.context.state();

    let res = await cs.save({
      _id: state._id,
      name: state.name,
      definition: {
        ...state,
        id: state._id,
      },
    });

    let newState = res.data.definition || {};
    props.context.setState({
      ...newState,
      _id: newState.id,
      id: newState.id,
    });

    props.context.save();

    loadApps();
  };

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

      <section className="section">
        <ul className="menu-list">
          {apps.map((item, idx) => (
            <li key={`app-${idx}`} className="menu-item">
              <a
                onClick={() => {
                  onLoadItem(item);
                }}
              >
                {item.name || item.id || item._id} {item._id}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="buttons">
          <button className="button" onClick={onSave}>
            Upload
          </button>
          <button className="button" onClick={onNewProject}>
            New Project
          </button>
        </div>
      </section>

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
