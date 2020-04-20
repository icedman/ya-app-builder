import React, { Fragment } from 'react';
import Registry, { EditorRegistry } from './Editor';
import Icon from 'components/icons/Icon';

import { guid, findById } from 'libs/utility';
import { useUI } from 'stores/UIStore';

function formatLabel(l) {
  return l;
}

function Edit(props) {
  return <div></div>;
}

function EditAttribute(props) {
  let Component =
    EditorRegistry[props.attribute.edit] ||
    EditorRegistry[props.attribute.type] ||
    Edit;

  // get value here!

  return <Component {...props} />;
}

function EditView(props) {
  const ui = useUI();

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

  let attributes = Object.keys(component.attributes).map((k) => {
    return component.attributes[k];
  });

  // split attrbitues to sections
  let sections = {
    general: {
      label: 'General',
      attributes: [],
    },
    layout: {
      label: 'Layout',
      attributes: [],
    },
    content: {
      label: 'Content',
      attributes: [],
    },
  };

  attributes.forEach((a) => {
    let s = a.section || 'general';
    if (!sections[s]) {
      sections[s] = {
        label: formatLabel(s),
        attributes: [],
      };
    }
    sections[s].attributes.push(a);
  });

  Object.keys(sections).forEach((k) => {
    if (!sections[k].attributes.length) {
      delete sections[k];
      return;
    }
    sections[k].attributes.sort((a, b) => {
      if (a.name === 'name') {
        return -1;
      }
      if (b.name === 'name') {
        return 1;
      }
      return a.name < b.name ? -1 : 1;
    });
  });

  let childrenTypes = [];
  if (component.children && component.children.types) {
    childrenTypes = [...component.children.types];
  }

  let childrenCategories = {};
  childrenTypes.forEach((a) => {
    let childInfo = Registry.get(a);
    let s = childInfo.category || 'add';
    if (!childrenCategories[s]) {
      childrenCategories[s] = {
        label: formatLabel(s),
        children: [],
      };
    }
    childrenCategories[s].children.push(a);
  });

  const onAddDrag = (evt, t) => {
    evt.stopPropagation();
    evt.preventDefault();

    let n = props.context.createNode({
      type: t,
    });

    let state = {};

    state.drag = n.id;
    state.dragType = n.type;
    state.newNode = n;
    state.dragPath = '_newNode';

    ui.dispatch(
      ui.setState({
        drag: {
          ...state,
        },
      })
    );
  };

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
        <li style={{ minHeight: '40px' }}>
          <span className="tag is-primary is-light m-r-2">{node.type}</span>
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

      <ul className="menu-list">
        {Object.keys(sections).map((k, idx) => {
          return (
            <Fragment key={`sc-${idx}`}>
              <li className="menu-label has-background-light">
                <a>{sections[k].label}</a>
              </li>
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
          );
        })}
      </ul>

      <hr />

      <ul className="menu-list">
        {Object.keys(childrenCategories).map((k, idx) => {
          return (
            <Fragment key={`ct-${idx}`}>
              <li className="menu-label has-background-light">
                <a>{childrenCategories[k].label}</a>
              </li>
              {childrenCategories[k].children.map((ct, idx) => {
                return (
                  <li
                    key={`ct-${idx}`}
                    draggable={true}
                    onDrag={(evt) => onAddDrag(evt, ct)}
                  >
                    <a
                      className="is-small"
                      onClick={() => {
                        onAddChild(ct);
                      }}
                    >
                      <Icon icon="faPlus" />
                      <span className="m-2">{ct}</span>
                    </a>
                  </li>
                );
              })}
            </Fragment>
          );
        })}
      </ul>

      <div className="m-1">
        <pre>{path}</pre>
        <pre>{JSON.stringify(component, null, 4)}</pre>
      </div>
    </div>
  );
}

export default EditView;
