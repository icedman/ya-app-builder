import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

import './TextBlock';

const element = {};

function PreviewElement(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name || node.id;

  return (
    <div {...props} className={clsx(props.className, 'node_model')}>
      <div>
        <span className="tag is-primary is-light m-r-2">{node.type}</span>
      </div>
      <hr />
      {renderChildrenPreview(node.children, props)}
    </div>
  );
}

Registry.add(element);

PreviewRegistry.add({
  PreviewElement,
});
