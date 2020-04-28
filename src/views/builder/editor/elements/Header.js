import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

const element = {
  header: {
    typeof: ['textBlock'],
    defaults: {
      size: 2,
    },
    attributes: {
      size: {
        type: 'select',
        options: [1, 2, 3, 4, 5],
      },
    },
    preview: 'PreviewHeader',
  },
};

function PreviewHeader(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return (
    <div {...props} className={clsx(props.className, 'node-header')}>
      {node.text ? (
        <h1 className={`title is-${node.size}`}>{node.text}</h1>
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
  PreviewHeader,
});

// EditorRegistry.add({
//   dataModel: EditDataModel,
//   dataField: EditDataField,
// });
