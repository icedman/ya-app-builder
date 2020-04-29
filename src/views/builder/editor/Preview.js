import React from 'react';
import Registry from './Editor';
import clsx from 'clsx';
import deepEqual from 'deep-equal';

import { PreviewRegistry } from './Registry';
import { guid, findById } from 'libs/utility';
import StateHelper from 'libs/stateHelper';
import debounce from 'debounce';

import { useUI } from 'stores/UIStore';

const fsUI = new StateHelper();
let state = {};

function renderChildrenPreview(children, props) {
  return (children || []).map((node, idx) => {
    return <Preview {...props} className="" node={node} key={`cp-${idx}`} />;
  });
}

function Preview(props) {
  let ui = useUI();

  fsUI.useContext(ui, ui.setState);

  let node = props.node;
  if (!node) {
    return <div></div>;
  }

  let componetInfo = Registry[node.type];

  if (!componetInfo) {
    return <div></div>;
  }

  let Component =
    PreviewRegistry[props.preview || componetInfo.preview || 'Container'];
  let onNodeSelect = props.context.onNodeSelect || (() => {});

  let opt = { key: 'id' };
  let n = findById(props.context.state(), node.id, opt);
  let path = opt.path.join('.');

  const nodePath = path;
  const nodeContent = JSON.stringify(node);

  const highlightSource = debounce((id) => {
    fsUI.setState({
      '_state.drag': id,
    });
  }, 0);

  const highlightTarget = debounce((id) => {
    fsUI.setState({
      '_state.dragOver': id,
    });
  }, 0);

  const onDragEnd = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    setTimeout(() => {
      fsUI.setState({
        '_state.drag': null,
        '_state.dragOver': null,
      });
    }, 250);
  };

  const onDrag = (evt) => {
    evt.stopPropagation();
    // evt.preventDefault();

    state.drag = node.id;
    state.dragType = node.type;
    // state.dragNode = nodeContent;
    state.dragPath = nodePath;

    highlightSource(node.id);
  };

  const onDrop = async (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    if (!state.canDrop) {
      return;
    }

    if (!state.dragPath) {
      let s = fsUI.getState('_state');
      let newNode = s.newNode;
      props.context.addNode(state.dropTargetPath, newNode);
      return;
    }

    if (!state.dragPath) {
      // oops?
      return;
    }

    let ds = state.dragPath.split('.');
    let dsIdx = Number(ds.pop());
    let dragSource = ds.join('.');

    let dt = state.dropTargetPath.split('.');
    let dtIdx = Number(dt.pop());
    let dropTarget = dt.join('.');

    let realDropTarget = props.context.getState(state.dropTargetPath);

    let realTargetFreeContainer =
      realDropTarget.type === 'container' &&
      (realDropTarget.children || []).length === 0;

    // sort children
    if (dragSource === dropTarget && !realTargetFreeContainer) {
      let dropToChildren = JSON.parse(
        JSON.stringify(props.context.getState(dropTarget) || [])
      );

      dropToChildren.forEach((c, idx) => {
        c._sortIndex = idx * 10;
        if (idx === dsIdx) {
          let nidx = dtIdx * 10 + (dsIdx < dtIdx ? 1 : -1);
          c._sortIndex = nidx;
        }
      });

      dropToChildren.sort((a, b) => {
        return a._sortIndex > b._sortIndex ? 1 : -1;
      });

      props.context.setState({
        [dropTarget]: dropToChildren,
      });

      return;
    }

    // TODO: reparent
    // let removed = props.context.removeNode(state.dragPath) || state.newNode;
    // props.context.addNode(state.dropTargetPath, removed);

    props.context.reparentNode(state.dragPath, state.dropTargetPath);
  };

  const _onDragOver = debounce(() => {
    // state = ui.state._state.drag;

    state.dropTarget = node.id;
    state.dropTargetPath = nodePath;
    state.canDrop = true;

    if (!state.dragPath) {
      return;
    }

    let ds = state.dragPath.split('.');
    let dsIdx = Number(ds.pop());
    let dragSource = ds.join('.');

    let dt = state.dropTargetPath.split('.');
    let dtIdx = Number(dt.pop());
    let dropTarget = dt.join('.');

    highlightTarget(node.id);

    if (dragSource === dropTarget) {
      state.canDrop = true;
    } else {
      if (componetInfo.children) {
        state.canDrop =
          componetInfo.children.types.indexOf(state.dragType) != -1;
      }
      if (!state.canDrop) {
        // drop to parent?
      }
    }
  }, 5);

  const onDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    _onDragOver();
  };

  let cls = [];
  if (props.focused && props.focused.id === props.node.id) {
    cls.push('is-node-focused');
  }
  if (ui.state._state.dragOver === props.node.id) {
    cls.push('is-node-targeted');
  }
  if (ui.state._state.drag === props.node.id) {
    cls.push('is-node-dragged');
  }

  return (
    <Component
      {...props}
      className={clsx(props.className, node.className, 'node-container', cls)}
      node={node}
      draggable={true}
      onDragStart={onDrag}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={(evt) => {
        onNodeSelect(node);
        evt.stopPropagation();
      }}
    />
  );
}

function previewNodePropsAreEqual(prevProps, nextProps) {
  // node children count
  let prev = { ...prevProps.node };
  let next = { ...nextProps.node };

  if (nextProps.preview && nextProps.preview.id === prev.id) {
    return false;
  }
  if (prevProps.preview && prevProps.preview.id === prev.id) {
    return false;
  }

  if ((prev.children || []).length != (prev.children || []).length) {
    return false;
  }

  // state
  return deepEqual(prev, next);
}

const PreviewTreeNodeMemo = React.memo(Preview, previewNodePropsAreEqual);

PreviewRegistry.add({
  Preview,
  renderChildrenPreview,
});

export default Preview;
