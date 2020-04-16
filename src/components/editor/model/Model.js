import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';

const model = {
  model: {
    children: {
      types: [ 'field' ],
    },
  },
  field: {
    defaults: {
      dataType: 'string'
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
  },
  'field:date': {
    typeof: [ 'field' ],
    defaults: {
      dataType: 'date',
      format: 'mm/dd/yyyy',
    },
    attributes: {
      format: {
        type: 'string',
      },
    },
  }
};


Object.keys(model).forEach(k => {
  if (k.indexOf('field:') === 0) {
    model.model.children.types.push(k);
  }
});

Registry.add(model);

function EditDataModel(props) {
  // get models
  return <div>select a data model</div>
}

function EditDataField(props) {
  // get models
  return <div>select a data field</div>
}

EditorRegistry.add({
  dataModel: EditDataModel,
  dataField: EditDataField
})