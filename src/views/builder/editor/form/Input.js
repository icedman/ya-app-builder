import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

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
        type: 'string',
      },
      dataField: {
        type: 'dataField',
      },
    },
  },
};

Registry.add(input);
