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

import { useApp } from 'stores/AppStore';

import { guid, findById } from 'libs/utility';

const fs = new TreeState();

function Builder(props) {
  const app = useApp();

  let tree = app.state;

  fs.useContext(app, app.setState);

  const onSelect = (item) => {
    fs.setState({
      '_state.selected': item,
      '_state.drag': null,
      '_state.dragOver': null,
    });
  };

  const onPreviewSelect = (item) => {
    fs.setState({
      '_state.selected': item,
      '_state.preview': item,
    });
  };

  fs.onNodeSelect = onSelect;

  let treeState = tree._state || {};

  let previewId = (treeState.preview || { id: 0 }).id;
  let previewNode = findById(fs.state(), previewId, { key: 'id' });

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
            node={tree}
            onSelect={onPreviewSelect}
            preview={treeState.preview}
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
            <div className="preview has-background-white p-1">
              <Preview
                node={previewNode}
                focused={treeState.selected}
                context={fs}
              />
            </div>
          ) : null}

          {/*
            <div className="has-background-white">
              <pre>{JSON.stringify(tree._state, null, 4)}</pre>
            </div>
          */}
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
          <Properties node={treeState.selected} context={fs} />
        </div>
      </div>
    </div>
  );
}

export default Builder;
