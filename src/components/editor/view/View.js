import React from 'react';

import Registry, { PreviewRegistry } from '../Registry';

Registry.add({
  contained: {
    attributes: {
      className: {
        type: 'string',
      },
      flex: {
        type: 'select',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    },
  },
  container: {
    typeof: ['contained'],
    categories: [],
    attributes: {
      orientation: {
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

  let color =
    props.focused && props.focused.id === props.node.id ? '#a0a0a0' : '#e5e5e5';
  let opacity = 100;

  if (props.context.getState('_state.dragOver') === props.node.id) {
    color = '#ff0000';
    opacity = 50;
  }
  if (props.context.getState('_state.drag') === props.node.id) {
    color = '#505050';
  }

  let name = props.node.name || `${props.node.type} - ${props.node.id}`;

  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  return (
    <div
      {...props}
      className="ash_container"
      style={{
        flexDirection: orientation,
        flex: flex,
        border: '2px dashed',
        borderColor: color,
        opacity: `${opacity}%`,
      }}
    >
      {name}
      {renderChildrenPreview(props.node.children, props)}
    </div>
  );
}

PreviewRegistry.add({
  Container
})