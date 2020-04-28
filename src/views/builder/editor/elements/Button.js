import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

const button = {
  button: {
    category: 'menu',
    parent: {
      types: ['view', 'container'],
    },
    typeof: ['contained'],
    attributes: {
      text: {
        section: 'content',
        type: 'string',
      },
      path: {
        type: 'string',
      },
      command: {
        type: 'string',
      },
    },
    preview: 'PreviewButton',
  },
};

function PreviewButton(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let label = node.text || node.name || node.type;

  return (
    <button
      {...props}
      className={clsx(props.className, 'button', 'node-button')}
    >
      {label}
    </button>
  );
}

Registry.add(button);

PreviewRegistry.add({
  PreviewButton,
});

// EditorRegistry.add({
//   dataModel: EditDataModel,
//   dataField: EditDataField,
// });
