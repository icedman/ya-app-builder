import React from 'react';
import { findById } from 'libs/utility';

const addDetailPage = (node, cx) => {
  return new Promise(async (resolve, reject) => {
    let modelName = node.name;
    let opt = { key: 'name' };
    let pageName = `${modelName}-detail-page`;
    let page = findById(cx.state(), pageName, opt);
    let pagePath = opt.path.join('.');

    let model =
      (cx.state().children || []).filter((c) => {
        return c.type === 'model' && c.name === modelName;
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

    resolve(page);
  });
};

const addListPage = (node, cx) => {
  return new Promise(async (resolve, reject) => {
    let modelName = node.name;
    let opt = { key: 'name' };
    let pageName = `${modelName}-list-page`;
    let page = findById(cx.state(), pageName, opt);
    let pagePath = opt.path.join('.');

    let model =
      (cx.state().children || []).filter((c) => {
        return c.type === 'model' && c.name === modelName;
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
    }

    // find container
    let containerOpt = { key: 'name' };
    let container = findById(page, 'main', containerOpt);
    let containerPath = pagePath + '.' + containerOpt.path.join('.');

    // find table
    let tableOpt = { key: 'name' };
    let table = findById(page, 'table', tableOpt);
    let tablePath = pagePath + '.' + tableOpt.path.join('.');

    if (!table) {
      table = await cx.addNodePromised(containerPath, {
        name: 'table',
        type: 'table',
      });

      tableOpt = { key: 'id' };
      table = findById(page, table.id, tableOpt);
      tablePath = pagePath + '.' + tableOpt.path.join('.');
    }

    if (!table) {
      resolve(page);
      return;
    }

    // add fields
    let children = table.children || [];
    (node.children || []).forEach((field) => {
      if (field.type.indexOf('field') !== 0) {
        return;
      }

      if (findById(table, field.name, { key: 'name' })) {
        return;
      }

      let fieldNode = cx.createNode({
        type: 'column',
        name: field.name,
        label: field.name,
        dataField: field.name,
      });

      children.push(fieldNode);
    });

    cx.setState({
      [`${tablePath}.children`]: children,
    });

    resolve(page);
  });
};

const generate = async (node, cx) => {
  await addDetailPage(node, cx);
  await addListPage(node, cx);
  await addListPage(node, cx); // to add the fields next
};

export default generate;
