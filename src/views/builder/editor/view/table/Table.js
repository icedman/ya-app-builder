import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../../Registry';
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
      let headerText = c.label || 'label';
      let cellText = c.dataField || c.text || c.label || c.name || 'text';
      let preview = 'Container';

      if (!c.children || !c.children.length) {
        preview = 'TextBlock';
      }

      header.push({
        id: c.id,
        text: headerText,
      });
      columns.push({
        ...c,
        _preview: preview,
      });
    }
  });

  return (
    <div {...props}>
      <div className="node_type_indicator">
        <span className="tag is-primary is-light m-r-2">{node.type}</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            {header.map((c, idx) => {
              return <th key={`th-${idx}`}>{c.text}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((c, idx) => {
              return (
                <td key={`td-${idx}`}>
                  <PreviewRegistry.Preview
                    {...props}
                    node={c}
                    preview={c._preview}
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

PreviewRegistry.add({
  PreviewTable,
});
