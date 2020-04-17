import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

const model = {
  model: {
    children: {
      types: ['field'],
    },
    preview: 'PreviewModel'
  },
  field: {
    defaults: {
      dataType: 'string',
    },
    attributes: {
      dataType: {
        type: 'select',
        options: [
          'string',
          'text',
          'number',
          'boolean',
          'date',
          'email',
          'password',
          'json',
          'file',
          'enumeration',
          'relation',
          { value: 'richText', label: 'rich text' },
        ],
      },
    },
    preview: 'PreviewField',
  },
  'field:text': {
    typeof: ['field'],
    defaults: {
      dataType: 'text'
    },
    preview: 'PreviewField',
  },
  'field:number': {
    typeof: ['field'],
    defaults: {
      dataType: 'number'
    },
    preview: 'PreviewField',
  },
  'field:boolean': {
    typeof: ['field'],
    defaults: {
      dataType: 'boolean'
    },
    preview: 'PreviewField',
  },
  'field:date': {
    typeof: ['field'],
    defaults: {
      dataType: 'date',
      format: 'mm/dd/yyyy',
    },
    attributes: {
      format: {
        type: 'string',
      },
    },
    preview: 'PreviewField',
  },
  'field:email': {
    typeof: ['field'],
    defaults: {
      dataType: 'email'
    },
    preview: 'PreviewField',
  },
  'field:password': {
    typeof: ['field'],
    defaults: {
      dataType: 'password'
    },
    preview: 'PreviewField',
  },
  'field:json': {
    typeof: ['field'],
    defaults: {
      dataType: 'json'
    },
    preview: 'PreviewField',
  },
  'field:file': {
    typeof: ['field'],
    defaults: {
      dataType: 'file'
    },
    preview: 'PreviewField',
  },
  'field:enumeration': {
    typeof: ['field'],
    defaults: {
      dataType: 'enumeration'
    },
    preview: 'PreviewField',
  },
  'field:relation': {
    typeof: ['field'],
    defaults: {
      dataType: 'relation'
    },
    preview: 'PreviewField',
  },
};

Object.keys(model).forEach((k) => {
  if (k.indexOf('field:') === 0) {
    model.model.children.types.push(k);
  }
});

function EditDataModel(props) {
  // get models
  return <div>select a data model</div>;
}

function EditDataField(props) {
  // get models
  return <div>select a data field</div>;
}

function PreviewModel(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return <div {...props} className={clsx(props.className, 'node_model')}>
    <div><span className='tag is-primary is-light m-r-2'>{node.type}</span> {name}</div>
    <hr/>
    {renderChildrenPreview(node.children, props)}
  </div>
}

function PreviewField(props) {
  let name = props.node.name || 'field';
  let dataType = props.node.dataType;

  let meta = props.meta;

  if (!meta) {
    meta = {
      ...props.node,
    };

    delete meta.id;
    delete meta.children;
    delete meta.type;
    delete meta.dataType;
    delete meta._sortIndex;
  }

  return (
    <div
      {...props}
      className={clsx(props.className, 'node_field')}
    >
      <div className="level m-2">
        <div className="level-left">
          <div className="" style={{ minWidth: '120px' }}>
            <b>{name}</b>
          </div>
          <div style={{ minWidth: '120px' }}>{dataType}</div>
          <div className="level-item">
            <code>{JSON.stringify(meta)}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

Registry.add(model);

PreviewRegistry.add({
  PreviewModel,
  PreviewField,
});

EditorRegistry.add({
  dataModel: EditDataModel,
  dataField: EditDataField,
});
