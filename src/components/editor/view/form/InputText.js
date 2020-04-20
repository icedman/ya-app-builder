import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

const input = {
  inputText: {
    typeof: ['input'],
    attributes: {
      placeholder: {
        type: 'text',
      },
      description: {
        type: 'text',
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
    <div {...props} className={clsx(props.className, 'field')}>
      <div className="label">{props.name}</div>
      <input className="input" type="text" placeholder={node.placeholder} />
      <p className="help">{node.description}</p>
    </div>
  );
}

Registry.add(input);

PreviewRegistry.add({
  PreviewInputText,
});

// EditorRegistry.add({
//   dataModel: EditDataModel,
//   dataField: EditDataField,
// });
