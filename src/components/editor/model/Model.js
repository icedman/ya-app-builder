import Registry from '../Registry';

Registry.add({
  model: {
    children: {
      types: ['field', 'field:date'],
    },
  },
  field: {
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
          { value: 'richText', label: 'rich text' }
        ]
      }
    },
  },
  'field:date': {
    default: {
      format: 'mm/dd/yyyy'
    },
      attributes: {
        format: {
          type: 'string'
        }
      }
  }
});
