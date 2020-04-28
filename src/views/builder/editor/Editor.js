import React from 'react';

import StateHelper from 'libs/stateHelper';
import { guid, injectId, findById } from 'libs/utility';

import Registry, { EditorRegistry } from './Registry';
import merge from 'merge';
import cache from 'libs/cache';

import deepEqual from 'deep-equal';

Registry.add({
  object: {
    attributes: {
      name: {
        type: 'string',
      },
    },
  },
});

export class TreeState extends StateHelper {
  save() {
    let state = this.state();
    let projectId = `project-${state.id}`;
    cache.put(projectId, state, { persist: true });
    cache.put('last-project', projectId, { persist: true });
  }

  load() {
    let projectId = cache.get('last-project') || 'project-default';
    let state = cache.get(projectId) || {};
    return state;
  }

  createNode(node) {
    if (node.type) {
      let newComponentInfo = Registry.get(node.type);

      if (newComponentInfo.defaults) {
        // console.log(node.type);
        // console.log(node);

        node = {
          ...newComponentInfo.defaults,
          ...node,
        };

        injectId(node, { key: 'id' });
      }
    }

    let newNode = {
      id: guid(),
      type: 'unknown',
      children: [],
      ...node,
    };

    return newNode;
  }

  addNode(path, node, opt) {
    opt = opt || {};
    let updatePath = path ? [path, 'children'].join('.') : 'children';
    let targetNode = this.getState(path);

    if (!targetNode) {
      // oops
      return;
    }

    let componentInfo = Registry.get(targetNode.type);
    if (componentInfo.children && componentInfo.types) {
      if (componentInfo.types.indexOf(node.type) == -1) {
        return false;
      }
    }

    let children = targetNode.children || [];
    let newNode = this.createNode(node, targetNode);

    this.setState({
      // _state: _state,
      [updatePath]: [...children, newNode],
    });

    return newNode;
  }

  addNodePromised(path, node, opt) {
    let self = this;
    return new Promise((resolve, reject) => {
      resolve(self.addNode(path, node, opt));
    });
  }

  removeNode(path) {
    let targetNode = this.getState(path);
    if (!targetNode) {
      return null;
    }

    let _state = this.getState('_state');

    if (_state.selected && _state.selected.id === targetNode.id) {
      _state.selected = null;
    }

    if (_state.preview && _state.preview.id === targetNode.id) {
      _state.preview = null;
    }

    this.setState({
      _state: _state,
      [path]: {
        $splice: 1,
      },
    });

    return targetNode;
  }

  async reparentNode(nodePath, newParentPath) {
    let node = await this.removeNodePromised(nodePath);
    if (node) {
      this.addNode(newParentPath, node);
    }
  }

  removeNodePromised(path) {
    let self = this;
    return new Promise((resolve, reject) => {
      resolve(self.removeNode(path));
    });
  }
}

function EditSelection(props) {
  // return <pre>
  //   {JSON.stringify(props, null, 4)}
  // </pre>

  let path = props.path
    ? [props.path, props.attribute.name].join('.')
    : props.attribute.name;
  let value = props.context.getState(path);

  const onChange = (v) => {
    props.context.setState({ [path]: v.target.value });
  };

  return (
    <div className="field">
      <div className="label">{props.attribute.name}</div>
      <div className="select is-small">
        <select onChange={onChange} defaultValue={value}>
          {props.attribute.options.map((opt, idx) => {
            let o = {
              label: opt.label || opt,
              value: opt.value || opt,
            };
            let sel = o.value === value;
            return (
              <option key={`opt-${idx}`} value={o.value}>
                {o.label}
              </option>
            );
          })}
        </select>
      </div>
      <p className="help">{props.attribute.description}</p>
    </div>
  );
}

const EditSelectionMemo = React.memo(EditSelection);

function EditString(props) {
  let path = props.path
    ? [props.path, props.attribute.name].join('.')
    : props.attribute.name;

  let value = props.context.getState(path);

  const onChange = (v) => {
    props.context.setState({ [path]: v.target.value });
  };
  return (
    <div className="field">
      <div className="label">{props.attribute.name}</div>
      <input
        className="input is-small"
        type="text"
        defaultValue={value}
        onChange={onChange}
      />
      <p className="help">{props.attribute.description}</p>
    </div>
  );
}

function EditBoolean(props) {
  let path = props.path
    ? [props.path, props.attribute.name].join('.')
    : props.attribute.name;

  let value = props.context.getState(path) ? true : false;

  const onChange = (v) => {
    props.context.setState({ [path]: v.target.checked });
  };

  return (
    <div className="field">
      <label className="checkbox label">
        {props.attribute.name}
        <input
          className="m-2"
          type="checkbox"
          defaultValue={value}
          onChange={onChange}
        />
        <p className="help">{props.attribute.description}</p>
      </label>
    </div>
  );
}

EditorRegistry.add({
  select: EditSelectionMemo,
  string: EditString,
  boolean: EditBoolean,
  text: EditorRegistry.string,
});

export default Registry;
export { EditorRegistry };
