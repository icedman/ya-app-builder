import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

const page = {
  page: {
    typeof: ['view'],
    attributes: {
      route: {
        type: 'text',
      },
      layout: {
        section: 'layout',
        type: 'select',
        options: ['main', 'minimal', 'full'],
      },
    },
  },
};

function EditPageUrl(props) {
  let options = [];

  let project = props.context.getState('root');

  (project.children || []).forEach((c) => {
    if (c.type === 'page' && c.name) {
      options.push({
        label: c.name,
        value: c.id,
      });
    }
  });

  let desc = props.attribute.description;
  if (!options.length) {
    desc = 'no page defined or named';
  }

  const Select = EditorRegistry.select;
  return (
    <Select
      {...props}
      attribute={{ ...props.attribute, options, description: desc }}
    />
  );
}

function PreviewTextBlock(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return (
    <div {...props} className={clsx(props.className, 'node-page')}>
      {node.text ? (
        node.text
      ) : (
        <div className="node_type_indicator">
          <span className="tag is-primary is-light m-r-2">{node.type}</span>
        </div>
      )}
      {renderChildrenPreview(node.children, props)}
    </div>
  );
}

Registry.add(page);

EditorRegistry.add({
  pageUrl: EditPageUrl,
});
