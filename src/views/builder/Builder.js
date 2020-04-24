import React from 'react';
import 'assets/_app.css';

import Registry, {
  EditorRegistry,
  PreviewRegistry,
  TreeState,
} from 'components/editor/Editor';

import 'components/editor/project';
import 'components/editor/view';
import 'components/editor/model';

import ProjectTree from 'components/editor/ProjectTree';
import Properties from 'components/editor/Properties';
import Preview from 'components/editor/Preview';
import Nav from './Nav';

import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

import { guid, findById } from 'libs/utility';

const fs = new TreeState();
const fsUI = new TreeState();

function Builder(props) {
  const app = useApp();
  const ui = useUI();

  fs.useContext(app, app.setState);
  fsUI.useContext(ui, ui.setState);

  const onSelect = (item) => {
    fsUI.setState({
      '_state.selected': {
        id: item.id,
        type: item.type,
      },
      '_state.drag': null,
      '_state.dragOver': null,
    });
  };

  const onPreviewSelect = (item) => {
    fsUI.setState({
      '_state.selected': {
        id: item.id,
        type: item.type,
      },
      '_state.preview': {
        id: item.id,
        type: item.type,
      },
    });
  };

  fs.onNodeSelect = onSelect;

  let treeState = ui.state._state || {};

  let previewId = (treeState.preview || app.state).id;
  let selectedId = (treeState.selected || app.state).id;
  let previewNode = findById(fs.state(), previewId, { key: 'id' });

  let appId = app.state.id;

  let navHeight = 60;

  return (
    <div className="App noselect">
      <Nav style={{ height: `${navHeight}px` }} context={fs} />
      <div style={{ display: 'flex', flexDirection: 'columns' }}>
        <div
          className="p-3"
          style={{
            flex: '1',
            minWidth: '240px',
            height: `calc(100vh - ${navHeight}px)`,
            overflowY: 'auto',
          }}
        >
          <ProjectTree
            key={`project-${appId}`}
            preview={previewNode}
            onSelect={onPreviewSelect}
            context={fs}
          />
        </div>

        <div
          className="has-background-grey-lighter p-3"
          style={{
            flex: '4',
            height: `calc(100vh - ${navHeight}px)`,
            overflowY: 'auto',
          }}
          onClick={() => {
            onSelect(previewNode);
          }}
        >
          {previewNode ? (
            <div
              key={`preview-${appId}`}
              className="preview has-background-white p-1"
            >
              <Preview
                node={previewNode}
                focused={treeState.selected}
                context={fs}
              />
            </div>
          ) : null}

          <div className="has-background-white">
            <pre>{JSON.stringify(ui.state._state, null, 4)}</pre>
          </div>
        </div>

        <div
          className="p-1"
          style={{
            flex: '1',
            minWidth: '240px',
            height: `calc(100vh - ${navHeight}px)`,
            overflowY: 'auto',
          }}
        >
          <Properties
            key={`properties-${selectedId}-${appId}`}
            node={treeState.selected}
            context={fs}
          />
        </div>
      </div>
    </div>
  );
}

export default Builder;
