import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

import './InputText';

const input = {
  input: {
    category: 'form',
    parent: {
      types: ['view', 'container', 'contained'],
    },
    children: {
      types: [],
    },
    typeof: ['contained'],
    attributes: {
      label: {
        type: 'text',
      },
      dataField: {
        type: 'dataField',
      },
    },
  },
};

Registry.add(input);
