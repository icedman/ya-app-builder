import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';

import { findById } from 'libs/utility';
import debounce from 'debounce';

const mock = {
  mock: {
    category: 'data',
    attributes: {
      data: {
        type: 'text',
      },
    },
    parent: {
      types: ['model'],
    },
    preview: 'PreviewMockData',
  },
};

function EditMockData(props) {
  let node = props.node;
  let name = props.node.name;

  let opt = { key: 'id' };
  let n = findById(props.context.state(), node.id, opt);
  let path = [...opt.path, 'data'].join('.');

  const saveText = debounce((v) => {
    props.context.setState({ [path]: v });
  }, 150);

  React.useEffect(() => {
    if (!node.data) {
      // props.context.setState({
      //   [path]: '{hello:0}'
      // })
    }
  }, [node.data]);

  const onChange = (v) => {
    saveText(v.target.value);
  };

  return (
    <div {...props} className={clsx(props.className, 'node_model')}>
      <div className="node_type_indicator">
        <span className="tag is-primary is-light m-r-2">{node.type}</span>{' '}
        {name} {path}
      </div>
      <textarea
        className="textarea"
        defaultValue={node.data}
        onChange={onChange}
      ></textarea>
    </div>
  );
}

function PreviewMockData(props) {
  let node = props.node;

  if (props.focused && props.focused.id === node.id) {
    return <EditMockData {...props} />;
  }

  let name = props.node.name;

  return (
    <div {...props} className={clsx(props.className, 'node_model')}>
      <div className="node_type_indicator">
        <span className="tag is-primary is-light m-r-2">{node.type}</span>{' '}
        {name}
      </div>
      <code>{node.data}</code>
    </div>
  );
}

Registry.add(mock);

PreviewRegistry.add({
  PreviewMockData,
});

// EditorRegistry.add({
// });
