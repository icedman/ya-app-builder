import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';
import { findById } from 'libs/utility';
import crud from 'libs/crud';
import generate from './generator';

const model = {
  model: {
    children: {
      types: [],
    },
    attributes: {
      name: {
        type: 'string',
        description: 'singular form',
      },
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
  let name = node.name; //  || node.id;
  let cx = props.context;

  let project = cx.state();

  const onGenerate = async () => {
    await generate(node, cx);
  };

  const onGenerateServerModels = async () => {
    let cx = crud('apps');
    let res = await cx.request(
      {
        _id: project.id,
        model: node,
      },
      { method: 'post', action: 'generate' }
    );
  };

  return (
    <div {...props} className={clsx(props.className, 'node-model')}>
      <div className="node_type_indicator">
        <span className="tag is-primary is-light m-r-2">{node.type}</span>{' '}
        {name}
      </div>
      <hr />
      {renderChildrenPreview(node.children, props)}

      <div className="section">
        <div className="buttons">
          <button className="button is-small" onClick={onGenerate}>
            Generate pages
          </button>
          <button className="button is-small" onClick={onGenerateServerModels}>
            Generate server models
          </button>
        </div>
      </div>
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
