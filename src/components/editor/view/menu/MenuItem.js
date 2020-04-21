import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
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
    },
    preview: 'PreviewMenuItem',
  },
  menuLabel: {
    category: 'menu',
    parent: {
      types: ['menu'],
    },
    attributes: {
      path: {
        text: 'text',
      },
    },
  },
  menuDivider: {
    category: 'menu',
    parent: {
      types: ['menu'],
    },
  },
};

function PreviewMenuItem(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return (
    <div {...props} className={clsx(props.className, 'node-view')}>
      {node.text ? (
        node.text
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
