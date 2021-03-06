import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

const input = {
  inputText: {
    typeof: ['input'],
    attributes: {
      placeholder: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      dataField: {
        type: 'dataField',
      },
    },
    preview: 'PreviewInputText',
  },
};

function PreviewInputText(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.label || node.name || node.id;

  return (
    <div
      {...props}
      className={clsx(props.className, 'node-field')}
      style={{ display: 'block' }}
    >
      <div className="label">{name}</div>
      <input className="input" type="text" placeholder={node.placeholder} />
      <p className="help">{node.description}</p>
    </div>
  );
}

Registry.add(input);

PreviewRegistry.add({
  PreviewInputText,
});
