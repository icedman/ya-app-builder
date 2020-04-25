import React from 'react';
import Registry, {
  EditorRegistry,
  PreviewRegistry,
} from 'components/editor/Registry';
import clsx from 'clsx';
import { findById } from 'libs/utility';

const model = {
  model: {
    children: {
      types: [],
    },
    preview: 'PreviewModel',
  },
};

function EditDataModel(props) {
  let options = [''];

  let project = props.context.state();

  (project.children || []).forEach((c) => {
    if (c.type === 'model' && c.name) {
      options.push({
        label: c.name,
        value: c.id,
      });
    }
  });

  const Select = EditorRegistry.select;
  return <Select {...props} attribute={{ ...props.attribute, options }} />;
}

function PreviewModel(props) {
  const renderChildrenPreview = PreviewRegistry.renderChildrenPreview;

  let node = props.node;
  let name = node.name; //  || node.id;
  let cx = props.context;

  const addDetailPage = () => {
    return new Promise(async (resolve, reject) => {
      let opt = { key: 'name' };
      let pageName = `${name}-detail-page`;
      let page = findById(cx.state(), pageName, opt);
      let pagePath = opt.path.join('.');

      let model =
        (cx.state().children || []).filter((c) => {
          return c.type === 'model' && c.name === node.name;
        })[0] || {};

      let dataModelId = model.id;

      // find existing page
      if (!page) {
        page = cx.createNode({
          name: pageName,
          type: 'page',
          dataModel: dataModelId,
        });

        page = await cx.addNodePromised(null, page);
        page = findById(cx.state(), pageName, opt); // find again to get path
        pagePath = opt.path.join('.');

        // subView
        let subView = findById(cx.state(), 'detail-toolbar', { key: 'name' });
        await cx.addNodePromised(pagePath, {
          type: 'subView',
          view: subView.id,
        });
      }

      // find container
      let containerOpt = { key: 'name' };
      let container = findById(page, 'main', containerOpt);
      let containerPath = pagePath + '.' + containerOpt.path.join('.');

      console.log(containerPath);

      // add fields
      let children = container.children || [];
      (node.children || []).forEach((field) => {
        if (field.type.indexOf('field') !== 0) {
          return;
        }

        if (findById(container, field.name, { key: 'name' })) {
          return;
        }

        let type = 'inputText';
        let fieldContainerNode = cx.createNode({
          type: 'container',
        });
        let fieldNode = cx.createNode({
          type,
          name: field.name,
          label: field.name,
          dataField: field.name,
        });

        fieldContainerNode.children = [fieldNode];

        children.push(fieldContainerNode);
      });

      cx.setState({
        [`${containerPath}.children`]: children,
      });

      setTimeout(() => {
        resolve(page);
      }, 10);
    });
  };

  const addListPage = () => {
    return new Promise(async (resolve, reject) => {
      let opt = { key: 'name' };
      let pageName = `${name}-list-page`;
      let page = findById(cx.state(), pageName, opt);

      // find existing page
      if (!page) {
        page = cx.createNode({
          name: pageName,
          type: 'page',
        });

        page = await cx.addNodePromised(null, page);
      }

      resolve(page);
    });
  };

  const onGenerate = async () => {
    await addDetailPage();
    await addListPage();
  };

  return (
    <div {...props} className={clsx(props.className, 'node-model')}>
      <div className="node_type_indicator">
        <span className="tag is-primary is-light m-r-2">{node.type}</span>{' '}
        {name}
      </div>
      <hr />
      {renderChildrenPreview(node.children, props)}

      <div className="section">
        <div className="buttons">
          <button className="button is-small" onClick={onGenerate}>
            Generate Pages
          </button>
        </div>
      </div>
    </div>
  );
}

Registry.add(model);

PreviewRegistry.add({
  PreviewModel,
});

EditorRegistry.add({
  dataModel: EditDataModel,
});
