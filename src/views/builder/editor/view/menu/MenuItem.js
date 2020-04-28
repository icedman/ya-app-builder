import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../../Registry';
import clsx from 'clsx';

const menuItem = {
  menuItem: {
    category: 'menu',
    parent: {
      types: ['menu'],
    },
    children: {
      types: ['menu'],
    },
    typeof: ['contained'],
    attributes: {
      path: {
        type: 'text',
      },
      command: {
        type: 'text',
      },
      label: {
        type: 'text',
      },
    },
    preview: 'PreviewMenuItem',
  },
  menuLabel: {
    category: 'menu',
    parent: {
      types: ['menuItem'],
    },
    attributes: {
      label: {
        type: 'text',
      },
    },
  },
  menuDivider: {
    category: 'menu',
  },
};

function PreviewMenuItem(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let text = node.label || node.text || node.name;

  return (
    <div {...props} className={clsx(props.className, 'node-view')}>
      {text ? (
        text
      ) : (
        <div className="node_type_indicator">
          <span className="tag is-primary is-light m-r-2">{node.type}</span>
        </div>
      )}
      {renderChildrenPreview(node.children, props)}
    </div>
  );
}

Registry.add(menuItem);

PreviewRegistry.add({
  PreviewMenuItem,
});

// EditorRegistry.add({
//   dataModel: EditDataModel,
//   dataField: EditDataField,
// });
