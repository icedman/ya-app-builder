import React from 'react';
import Registry from './Editor';

import { PreviewRegistry } from './Registry';

import { guid, findById } from 'libs/utility';
import debounce from 'debounce';

const state = {};

function renderChildrenPreview(children, props) {
  return (children || []).map((node, idx) => {
    return <Preview {...props} node={node} key={`cp-${idx}`} />;
  });
}

function Preview(props) {
  let node = props.node;
  if (!node) {
    return <div></div>;
  }

  let componetInfo = Registry[node.type];

  if (!componetInfo) {
    return <div></div>
  }
  
  let Component = PreviewRegistry[componetInfo.preview || 'Container'];
  let onFocus = props.onFocus || (() => {});

  let opt = { key: 'id' };
  let n = findById(props.context.state(), node.id, opt);
  let path = opt.path.join('.');

  const nodePath = path;
  const nodeContent = JSON.stringify(node);

  const highlightSource = debounce((id) => {
    props.context.setState({
      '_state.drag': id,
    });
  }, 50);

  const highlightTarget = debounce((id) => {
    props.context.setState({
      '_state.dragOver': id,
    });
  }, 50);

  const onDrag = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    state.drag = node.id;
    state.dragType = node.type;
    state.dragNode = nodeContent;
    state.dragPath = nodePath;

    highlightSource(node.id);
  };

  const onDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    if (!state.canDrop) {
      return;
    }

    setTimeout(() => {
      props.context.setState({
        '_state.drag': null,
        '_state.dragOver': null,
      });
    }, 50);

    let ds = state.dragPath.split('.');
    let dsIdx = Number(ds.pop());
    let dragSource = ds.join('.');

    let dt = state.dropTargetPath.split('.');
    let dtIdx = Number(dt.pop());
    let dropTarget = dt.join('.');

    if (dragSource === dropTarget) {
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

    // reparent
    let removed = props.context.removeNode(state.dragPath);
    setTimeout(() => {
      props.context.addNode(state.dropTargetPath, removed);
    }, 0);
  };

  const onDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    state.dropTarget = node.id;
    state.dropTargetPath = nodePath;
    state.canDrop = true;

    let ds = state.dragPath.split('.');
    let dsIdx = Number(ds.pop());
    let dragSource = ds.join('.');

    let dt = state.dropTargetPath.split('.');
    let dtIdx = Number(dt.pop());
    let dropTarget = dt.join('.');

    if (dragSource === dropTarget) {
      state.canDrop = true;
      highlightTarget(node.id);
      return;
    }

    if (componetInfo.children) {
      state.canDrop = componetInfo.children.types.indexOf(state.dragType) != -1;
      // console.log(componetInfo.children.types.indexOf(state.dragType));
      // console.log(componetInfo.children.types);
    }
  };

  return (
    <Component
      {...props}
      node={node}
      draggable={true}
      onDrag={onDrag}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={(evt) => {
        onFocus(node);
        evt.stopPropagation();
      }}
    />
  );
}

PreviewRegistry.add({
  Preview,
  renderChildrenPreview
});

export default Preview;
