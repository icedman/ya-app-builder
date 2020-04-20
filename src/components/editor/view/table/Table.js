import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

const table = {
  table: {
    category: 'table',
    parent: {
      types: ['view', 'container', 'contained'],
    },
    children: {
      types: [],
    },
    typeof: ['contained'],
    attributes: {},
  },
};

Registry.add(table);
