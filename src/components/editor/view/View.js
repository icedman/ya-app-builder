import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

Registry.add({
  contained: {
    attributes: {
      className: {
        section: 'layout',
        type: 'string',
      },
      flex: {
        section: 'layout',
        type: 'select',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    },
  },
  container: {
    typeof: ['contained'],
    defaults: {
      orientation: 'horizontal',
    },
    attributes: {
      orientation: {
        section: 'layout',
        type: 'select',
        options: [
          {
            value: 'horizontal',
            label: 'horizontal',
          },
          {
            value: 'vertical',
            label: 'vertical',
          },
        ],
      },
    },
    children: {
      types: ['container'],
    },
    preview: 'Container',
  },
  view: {
    defaults: {
      orientation: 'vertical',
    },
    attributes: {
      dataModel: {
        type: 'dataModel',
      },
    },
    children: {
      types: ['container'],
    },
    typeof: ['container', 'contained'],
    preview: 'Container',
  },
});

function Container(props) {
  let orientation = props.node.orientation === 'horizontal' ? 'row' : 'column';
  let flex = props.node.flex || (orientation === 'column' ? 1 : null);

  let node = props.node;
  let name = node.name || node.id;

  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  return (
    <div
      {...props}
      className={clsx(props.className, 'node_view')}
      style={{
        flexDirection: orientation,
        flex: flex,
      }}
    >
      {!node.children || !node.children.length ? (
        <div className="node_type_indicator">
          <span className="tag is-primary is-light m-r-2">{node.type}</span>
        </div>
      ) : null}
      {renderChildrenPreview(node.children, props)}
    </div>
  );
}

PreviewRegistry.add({
  Container,
});
