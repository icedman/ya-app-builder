import React, { Fragment} from 'react';
import Registry, { EditorRegistry } from './Editor';
import Icon from 'components/icons/Icon';

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

  let component = Registry.get(node.type);
  if (!component) {
    return <div></div>;
  }

  let opt = { key: 'id' };
  let n = findById(props.context.state(), node.id, opt);
  let path = opt.path.join('.');

  let attributes = component.attributes;

  // split attrbitues to sections
  let sections = {
    general: {
      label: 'General',
      attributes: []
    },
    layout: {
      label: 'Layout',
      attributes: []
    },
    content: {
      label: 'Content',
      attributes: []
    }
  }

  attributes.forEach(a => {
    let s = a.section || 'general';
    if (!sections[s]) {
      sections[s] = {
        label: s,
        attributes: []
      }
    }
    sections[s].attributes.push(a);
  })

  Object.keys(sections).forEach(k => {
    if (!sections[k].attributes.length) {
      delete sections[k];
      return;
    }
    sections[k].attributes.sort((a,b) => {
        if (a.name === 'name') {
          return -1;
        }
        if (b.name === 'name') {
          return 1;
        }
        return a.name < b.name ? -1 : 1;
    })
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
            <button
              className="button is-danger is-small is-pulled-right"
              onClick={onDelete}
            >
              <Icon icon="faTrash" />
            </button>
          ) : (
            ''
          )}
        </li>
      </ul>
      <ul>
      {Object.keys(sections).map((k, idx) => {
        return <Fragment key={`sc-${idx}`}>
          <li>{sections[k].label}</li>
          {sections[k].attributes.map((at, idx) => {
            return (
              <li className="p-1" key={`at-${idx}`}>
                <EditAttribute
                  attribute={at}
                  context={props.context}
                  path={path}
                />
              </li>
            );
          })}
        </Fragment>
      })}
      </ul>

      <ul className="menu-list">
        {childrenTypes.map((ct, idx) => {
          return (
            <li key={`ct-${idx}`}>
              <a
                className="is-small"
                onClick={() => {
                  onAddChild(ct);
                }}
              >
                <Icon icon="faPlus" />
                <span className="m-2">add {ct}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className='m-1'>
      <pre>{path}</pre>
      <pre>{JSON.stringify(component, null, 4)}</pre>
      </div>
    </div>
  );
}

export default EditView;
