import React from 'react';

import './assets/_app.css';

import Registry, { EditorRegistry, PreviewRegistry, TreeState } from 'components/editor/Editor';
import 'components/editor/project/Project';
import 'components/editor/view/View';
import 'components/editor/model/Model';

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
    <div className="App noselect">
      <div style={{ display: 'flex', flexDirection: 'columns' }}>
        <div className='p-3' style={{ flex: '1', minWidth: '240px', height: '100vh', overflowY: 'auto' }}>
          <ProjectTree
            node={tree.root}
            onSelect={onTreeSelect}
            preview={tree._state.preview}
            context={fs}
          />
        </div>

        <div className="has-background-grey-lighter p-3" style={{ flex: '4', height: '100vh', overflowY: 'auto' }}>
          
          <div className="has-background-white p-1">
          <Preview
            node={previewNode}
            onFocus={onSelect}
            focused={tree._state.selected}
            context={fs}
          />
          </div>

          <div className="has-background-white">
          <pre>{JSON.stringify(tree._state, null, 4)}</pre>
          </div>
          
        </div>

        <div className='p-1' style={{ flex: '1', minWidth: '240px', height: '100vh', overflowY: 'auto' }}>
          <Properties node={tree._state.selected} context={fs} />
        </div>
      </div>
    </div>
  );
}

export default App;
