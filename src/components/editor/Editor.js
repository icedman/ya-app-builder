import React from 'react';
import View from './view/View';
import Model from './model/Model';

import StateHelper from 'libs/stateHelper';
import { guid, findById } from 'libs/utility';

const Registry = {
  object: {
    attributes: {
      name: {
        type: 'string',
      },
    },
  },
  project: {
    children: {
      showInTree: false,
      types: ['view', 'model'],
    },
    preview: 'Project',
  },
  ...View,
  ...Model,
};

export class TreeState extends StateHelper {
  save() {}

  load() {}

  addNode(path, node, opt) {
    opt = opt || {};
    let updatePath = [path, 'children'].join('.');
    let targetNode = this.getState(path);
    let children = targetNode.children || [];

    if (node.type) {
      let componentInfo = Registry[targetNode.type];
      if (componentInfo.children && componentInfo.types) {
        if (componentInfo.types.indexOf(node.type) == -1) {
          return false;
        }
      }
    }

    let newNode = {
      id: guid(),
      children: [],
      ...node,
    };

    let _state = this.getState('_state');
    if (opt.focus) {
      _state.selected = newNode;
    }
    if (opt.preview) {
      _state.preview = newNode;
    }

    this.setState({
      _state: _state,
      [updatePath]: [...children, newNode],
    });

    return newNode;
  }

  removeNode(path) {
    let targetNode = this.getState(path);
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
}

export const EditorRegistry = {
  select: (props) => {
    let path = [props.path, props.attribute.name].join('.');
    let value = props.context.getState(path);

    const onChange = (v) => {
      props.context.setState({ [path]: v.target.value });
    };

    return (
      <div className="field">
        <div className="label">{props.attribute.name}</div>
        <div className="select is-small">
          <select onChange={onChange} defaultValue={value}>
            <option></option>
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
      </div>
    );
  },

  string: (props) => {
    let path = [props.path, props.attribute.name].join('.');
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
      </div>
    );
  },
};

export default Registry;
