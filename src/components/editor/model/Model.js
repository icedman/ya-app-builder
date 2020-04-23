import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

const model = {
  model: {
    children: {
      types: [],
    },
    preview: 'PreviewModel',
  },
};

function EditDataModel(props) {
  let options = [''];

  let project = props.context.state();

  (project.children || []).forEach((c) => {
    if (c.type === 'model' && c.name) {
      options.push({
        label: c.name,
        value: c.id,
      });
    }
  });

  const Select = EditorRegistry.select;
  return <Select {...props} attribute={{ ...props.attribute, options }} />;
}

function PreviewModel(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return (
    <div {...props} className={clsx(props.className, 'node-model')}>
      <div className="node_type_indicator">
        <span className="tag is-primary is-light m-r-2">{node.type}</span>{' '}
        {name}
      </div>
      <hr />
      {renderChildrenPreview(node.children, props)}
    </div>
  );
}

Registry.add(model);

PreviewRegistry.add({
  PreviewModel,
});

EditorRegistry.add({
  dataModel: EditDataModel,
});
