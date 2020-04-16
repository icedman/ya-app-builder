import React from 'react';

import './assets/_app.css';

import Registry, { EditorRegistry, TreeState } from 'components/editor/Editor';
import ProjectTree from 'components/editor/ProjectTree';
import Properties from 'components/editor/Properties';
import Preview from 'components/editor/Preview';

import { guid, findById } from 'libs/utility';

const fs = new TreeState();

function App() {
  // const [state, setState] = React.useState({});
  const [tree, setTree] = React.useState({
    root: {
      id: guid(),
      type: 'project',
    },
    _state: {},
  });

  fs.useState(tree, setTree);

  const onSelect = (item) => {
    setTree({
      ...tree,
      _state: {
        ...tree._state,
        selected: item,
        drag: null,
        dragOver: null,
      },
    });
  };

  const onTreeSelect = (item) => {
    setTree({
      ...tree,
      _state: {
        selected: item,
        preview: item,
      },
    });
  };

  fs.refreshOnDelete = (id) => {
    let s = { ...tree };
    if (tree._state.selected && tree._state.selected.id === id) {
      delete s.selected;
    }
    if (tree._state.preview && tree._state.preview.id === id) {
      delete s.preview;
    }
    setTree(s);
  };

  let previewId = (tree._state.preview || { id: 0 }).id;
  let previewNode = findById(fs.state(), previewId, { key: 'id' });

  return (
    <div className="App">
      <div className="ash_container">
        <div style={{ flex: '1', minWidth: '240px' }}>
          <ProjectTree
            node={tree.root}
            onSelect={onTreeSelect}
            preview={tree._state.preview}
            context={fs}
          />
        </div>

        <div className="noselect" style={{ flex: '4' }}>
          <Preview
            node={previewNode}
            onFocus={onSelect}
            focused={tree._state.selected}
            context={fs}
          />
          <pre>{JSON.stringify(tree._state, null, 4)}</pre>
        </div>

        <div style={{ flex: '1', minWidth: '240px' }}>
          <Properties node={tree._state.selected} context={fs} />
        </div>
      </div>
    </div>
  );
}

export default App;
