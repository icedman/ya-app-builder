import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

const menu = {
  menu: {
    category: 'menu',
    parent: {
      types: ['view', 'container', 'contained'],
    },
    children: {
      types: [],
    },
    typeof: ['contained'],
    attributes: {},
    preview: 'PreviewMenu',
  },
};

function PreviewMenu(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return (
    <div {...props} className={clsx(props.className, 'node_model')}>
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

Registry.add(menu);

PreviewRegistry.add({
  PreviewMenu,
});

// EditorRegistry.add({
//   dataModel: EditDataModel,
//   dataField: EditDataField,
// });
