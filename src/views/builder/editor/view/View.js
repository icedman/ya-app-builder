import React from 'react';
import Registry, { EditorRegistry, PreviewRegistry } from '../Registry';
import clsx from 'clsx';

import { findById } from 'libs/utility';

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
        options: [
          { value: '', label: 'none' },
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
        ],
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
  subView: {
    parent: {
      types: ['container', 'view'],
    },
    attributes: {
      view: {
        type: 'text',
        edit: 'subView',
      },
    },
    preview: 'SubView',
  },
});

function SubView(props) {
  let node = props.node;
  if (!node.view) {
    return <Container {...props} />;
  }

  let subView;
  let project = props.context.state();

  (project.children || []).forEach((c) => {
    if (c.type === 'view' && c.id === node.view) {
      subView = c;
    }
  });

  if (subView) {
    return (
      <div {...props} className={clsx(props.className, 'node-sub-view')}>
        <div className="node_type_indicator">
          <span className="tag is-primary is-light m-r-2">{node.type}</span>
        </div>

        <PreviewRegistry.Preview context={props.context} node={subView} />
      </div>
    );
  }

  return (
    <div {...props} className={clsx(props.className, 'node-sub-view')}>
      {node.view}
    </div>
  );
}

function EditSubview(props) {
  let options = [''];

  let project = props.context.state();

  (project.children || []).forEach((c) => {
    if (c.type === 'view' && c.name) {
      options.push({
        label: c.name,
        value: c.id,
      });
    }
  });

  const Select = EditorRegistry.select;
  return <Select {...props} attribute={{ ...props.attribute, options }} />;
}

function Container(props) {
  let orientation = props.node.orientation === 'horizontal' ? 'row' : 'column';
  let flex = props.node.flex || (orientation === 'column' ? 1 : null);

  let node = props.node;
  let name = node.name || node.id;

  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  return (
    <div
      {...props}
      className={clsx(props.className, 'node-view')}
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
  SubView,
});

EditorRegistry.add({
  subView: EditSubview,
});
