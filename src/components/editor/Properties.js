import React from 'react';
import Registry, { EditorRegistry } from './Editor';

import { guid, findById } from 'libs/utility';

function Edit(props) {
  return <div>{props.attribute.name}</div>;
}

function EditAttribute(props) {
  let Component = EditorRegistry[props.attribute.type] || Edit;
  return <Component {...props} />;
}

function EditView(props) {
  let node = props.node;
  if (!node) {
    return <div></div>;
  }

  let component = Registry[node.type];
  if (!component) {
    return <div></div>;
  }

  let opt = { key: 'id' };
  let n = findById(props.context.state(), node.id, opt);
  let path = opt.path.join('.');

  let componentAttributes = {};

  [...(component.typeof || []), 'object'].forEach((t) => {
    let inherit = Registry[t];
    componentAttributes = {
      ...componentAttributes,
      ...inherit.attributes,
    };
  });

  componentAttributes = {
    ...componentAttributes,
    ...component.attributes,
  };

  // merge
  let attributes = Object.keys(componentAttributes).map((k) => {
    return {
      name: k,
      ...componentAttributes[k],
    };
  });

  let childrenTypes = [];

  if (component && component.children && component.children.types) {
    component.children.types.forEach((m) => {
      if (m === 'any') {
        Object.keys(Registry).forEach((a) => {
          childrenTypes.push(a);
        });
        return;
      }
      childrenTypes.push(m);
    });
  }

  const onDelete = () => {
    props.context.removeNode(path);
  };

  const onAddChild = (ct) => {
    props.context.addNode(path, {
      type: ct,
    });
  };

  return (
    <div key={`attributes-${path}`}>
      <ul>
        <li>
          &nbsp;
          {path !== 'root' ? (
            <button class="button is-small is-pulled-right" onClick={onDelete}>
              Delete
            </button>
          ) : (
            ''
          )}
        </li>
      </ul>
      <ul>
        {attributes.map((at, idx) => {
          return (
            <li className="p-3" key={`at-${idx}`}>
              <EditAttribute
                attribute={at}
                context={props.context}
                path={path}
              />
            </li>
          );
        })}
      </ul>
      <ul>
        {childrenTypes.map((ct, idx) => {
          return (
            <li key={`ct-${idx}`}>
              <button
                className="button is-small"
                onClick={() => {
                  onAddChild(ct);
                }}
              >
                Add {ct}
              </button>
            </li>
          );
        })}
      </ul>

      <pre>{path}</pre>
      <pre>{JSON.stringify(component, null, 4)}</pre>
    </div>
  );
}

export default EditView;
