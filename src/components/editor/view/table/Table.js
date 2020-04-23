import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

import { guid } from 'libs/utility';

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
    defaults: {
      orientation: 'horizontal',
    },
    preview: 'PreviewTable',
  },
  column: {
    category: 'table',
    parent: {
      types: ['table'],
    },
    attributes: {
      label: {
        category: 'content',
        type: 'text',
      },
      text: {
        category: 'content',
        type: 'text',
      },
    },
    typeof: ['container'],
  },
};

Registry.add(table);

function PreviewTable(props) {
  let header = [];
  let columns = [];

  let node = props.node;

  node.children.forEach((c) => {
    if (c.type === 'column') {
      header.push({
        id: c.id,
        type: 'textBlock',
        text: c.label,
      });
      columns.push({
        id: c.id,
        type: 'textBlock',
        text: c.name || c.dataField,
      });
    }
  });

  return (
    <table>
      <tr>
        {header.map((c, idx) => {
          return (
            <th key={`th-${idx}`}>
              <PreviewRegistry.Preview {...props} node={c} />
            </th>
          );
        })}
      </tr>
      <tr>
        {columns.map((c, idx) => {
          return (
            <td key={`td-${idx}`}>
              <PreviewRegistry.Preview {...props} node={c} />
            </td>
          );
        })}
      </tr>
    </table>
  );
}

PreviewRegistry.add({
  PreviewTable,
});
