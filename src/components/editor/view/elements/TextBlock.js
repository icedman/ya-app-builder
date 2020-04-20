import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

const element = {
  textBlock: {
    category: 'elements',
    parent: {
      types: ['view', 'container', 'contained'],
    },
    children: {
      types: [],
    },
    typeof: ['contained'],
    attributes: {
      text: {
        section: 'content',
        type: 'text',
      },
      dataField: {
        type: 'dataField',
      },
    },
    preview: 'PreviewTextBlock',
  },
};

function PreviewTextBlock(props) {
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

Registry.add(element);

PreviewRegistry.add({
  PreviewTextBlock,
});

// EditorRegistry.add({
//   dataModel: EditDataModel,
//   dataField: EditDataField,
// });
