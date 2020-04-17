import React, { Fragment } from 'react';
import Icon from 'components/icons/Icon';

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
                <TreeNode {...props} node={c} />
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

export default function ProjectTree(props) {
  let views = (props.node.children || []).filter((v) => {
    return v.type === 'view';
  });

  let models = (props.node.children || []).filter((v) => {
    return v.type === 'model';
  });

  let cats = [
    {
      label: 'Views',
      items: views,
      type: 'view',
    },

    {
      label: 'Models',
      items: models,
      type: 'model',
    },
  ];

  const onAdd = (t) => {
    let node = props.context.addNode(
      'root',
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
          <TreeNode {...props} />
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
                    <TreeNode {...props} node={v} />
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
                  <span className="m-2">Add {c.type}</span>
                </a>
              </li>
            </ul>
          </Fragment>
        );
      })}
    </aside>
  );
}
