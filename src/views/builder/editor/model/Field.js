import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

const field = {
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
      dataType: 'text',
    },
    preview: 'PreviewField',
  },
  'field:number': {
    typeof: ['field'],
    defaults: {
      dataType: 'number',
    },
    preview: 'PreviewField',
  },
  'field:boolean': {
    typeof: ['field'],
    defaults: {
      dataType: 'boolean',
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
      dataType: 'email',
    },
    preview: 'PreviewField',
  },
  'field:password': {
    typeof: ['field'],
    defaults: {
      dataType: 'password',
    },
    preview: 'PreviewField',
  },
  'field:json': {
    typeof: ['field'],
    defaults: {
      dataType: 'json',
    },
    preview: 'PreviewField',
  },
  'field:file': {
    typeof: ['field'],
    defaults: {
      dataType: 'file',
    },
    preview: 'PreviewField',
  },
  'field:enumeration': {
    typeof: ['field'],
    defaults: {
      dataType: 'enumeration',
    },
    preview: 'PreviewField',
  },
  'field:relation': {
    typeof: ['field'],
    defaults: {
      dataType: 'relation',
    },
    attributes: {
      dataModel: {
        type: 'dataModel',
      },
    },
    preview: 'PreviewField',
  },
};

Object.keys(field).forEach((k) => {
  if (k.indexOf('field') === 0) {
    field[k].parent = {
      types: ['model'],
    };
  }
});

function EditDataField(props) {
  let dataModelId;
  let dataModel;

  let project = props.context.state();

  // get models
  let path = props.path.split('.');
  while (path.length) {
    let c = path.pop();
    if (c === 'children') {
      let parentPath = path.join('.');
      let parentComponent = props.context.getState(parentPath);
      if (parentComponent.dataModel) {
        dataModelId = parentComponent.dataModel;
        break;
      }
    }
  }

  if (!dataModelId) {
    return <div></div>;
  }

  (project.children || []).forEach((c) => {
    if (c.type === 'model' && c.id === dataModelId) {
      dataModel = c;
    }
  });

  if (!dataModel) {
    return <div className="tag is-danger">dataModel not found</div>;
  }

  let options = [''];

  (dataModel.children || []).forEach((c) => {
    if (c.name && c.type.indexOf('field') === 0) {
      options.push({
        label: c.name,
        value: c.name,
      });
    }
  });

  const Select = EditorRegistry.select;
  return (
    <Select
      {...props}
      attribute={{
        ...props.attribute,
        options,
        description: `model: ${dataModel.name}`,
      }}
    />
  );
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
    <div {...props} className={clsx(props.className, 'node-field')}>
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

Registry.add(field);

PreviewRegistry.add({
  PreviewField,
});

EditorRegistry.add({
  dataField: EditDataField,
});
