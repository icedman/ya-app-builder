import React, { Fragment } from 'react';
import Icon from 'components/icons/Icon';
import deepEqual from 'deep-equal';

import Registry, { EditorRegistry } from 'components/editor/Editor';

function TreeNode(props) {
  let node = props.node;

  if (!node) {
    return <div></div>;
  }

  let component = Registry[node.type];
  let className = '';
  let name = node.name || node.type;

  if (props.preview && props.preview.id === props.node.id) {
    className = 'is-active';
  }

  return (
    <div>
      <a
        className={className}
        onClick={() => {
          props.onSelect(node);
        }}
      >
        {name}{' '}
      </a>
      {component.children && component.children.showInTree && node.children ? (
        <ul className="menu-list">
          {node.children.map((c, idx) => {
            return (
              <li key={c.id}>
                <TreeNodeMemo {...props} node={c} />
              </li>
            );
          })}
        </ul>
      ) : (
        ''
      )}
    </div>
  );
}

function treeNodePropsAreEqual(prevProps, nextProps) {
  // node children count
  let prev = { ...prevProps.node };
  let next = { ...nextProps.node };

  if (nextProps.preview && nextProps.preview.id === prev.id) {
    return false;
  }
  if (prevProps.preview && prevProps.preview.id === prev.id) {
    return false;
  }
  if (nextProps.selected && nextProps.selected.id === prev.id) {
    return false;
  }
  if (prevProps.selected && prevProps.selected.id === prev.id) {
    return false;
  }

  if ((prev.children || []).length != (prev.children || []).length) {
    return false;
  }

  // state
  return deepEqual(prev, next);
}

const TreeNodeMemo = React.memo(TreeNode, treeNodePropsAreEqual);

export default function ProjectTree(props) {
  let node = props.node || {};

  let cats = [
    {
      label: 'Pages',
      items: (node.children || [])
        .filter((v) => {
          return v.type === 'page';
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
      type: 'page',
    },
    {
      label: 'Views',
      items: (node.children || [])
        .filter((v) => {
          return v.type === 'view';
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
      type: 'view',
    },
    {
      label: 'Menus',
      items: (node.children || [])
        .filter((v) => {
          return v.type === 'menu';
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
      type: 'menu',
    },
    {
      label: 'Models',
      items: (node.children || [])
        .filter((v) => {
          return v.type === 'model';
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
      type: 'model',
    },
  ];

  const onAdd = (t) => {
    let node = props.context.addNode(
      null,
      {
        type: t,
      },
      {
        focus: true,
        preview: true,
      }
    );
  };

  return (
    <aside className="menu">
      <p className="menu-label">Project</p>
      <ul className="menu-list">
        <li>
          <TreeNodeMemo {...props} node={node} />
        </li>
      </ul>

      {cats.map((c, idx) => {
        return (
          <Fragment key={`cat-${idx}`}>
            <p className="menu-label">{c.label}</p>
            <ul className="menu-list">
              {c.items.map((v, idx) => {
                return (
                  <li key={`view-${idx}`}>
                    <TreeNodeMemo {...props} node={v} />
                  </li>
                );
              })}
              <li>
                <a
                  onClick={() => {
                    onAdd(c.type);
                  }}
                >
                  <Icon icon="faPlus" />
                  <span className="m-2">add {c.type}</span>
                </a>
              </li>
            </ul>
          </Fragment>
        );
      })}
    </aside>
  );
}
