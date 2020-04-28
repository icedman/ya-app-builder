import React from 'react';
import { findById } from 'libs/utility';
import pluralize from 'pluralize';

const addDetailPage = (node, cx) => {
  return new Promise(async (resolve, reject) => {
    let modelName = node.name;
    let pluralModelName = pluralize(modelName);
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
        route: `/${pluralModelName}/:id`,
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

    resolve(page);
  });
};

const addDetailFields = (node, page, cx) => {
  return new Promise(async (resolve, reject) => {
    let modelName = node.name;
    let opt = { key: 'id' };
    let pageName = `${modelName}-detail-page`;

    page = findById(cx.state(), page.id, opt);
    let pagePath = opt.path.join('.');

    let model =
      (cx.state().children || []).filter((c) => {
        return c.type === 'model' && c.name === modelName;
      })[0] || {};

    let dataModelId = model.id;

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
    let pluralModelName = pluralize(modelName);
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
        route: `/${pluralModelName}-list`,
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

    if (!findById(container, 'list-toolbar', { key: 'name' })) {
      // subView
      let subView = findById(cx.state(), 'list-toolbar', { key: 'name' });
      if (subView) {
        await cx.addNodePromised(containerPath, {
          name: 'list-toolbar',
          type: 'subView',
          view: subView.id,
        });
      }
    }

    // find table
    let tableOpt = { key: 'name' };
    let table = findById(page, 'table', tableOpt);
    let tablePath = pagePath + '.' + tableOpt.path.join('.');

    if (!table) {
      table = await cx.addNodePromised(containerPath, {
        name: 'table',
        type: 'table',
      });
    }

    resolve(page);
  });
};

const addListFields = (node, page, cx) => {
  return new Promise(async (resolve, reject) => {
    let modelName = node.name;
    let opt = { key: 'name' };
    let pageName = `${modelName}-list-page`;
    page = findById(cx.state(), pageName, opt);
    let pagePath = opt.path.join('.');

    let model =
      (cx.state().children || []).filter((c) => {
        return c.type === 'model' && c.name === modelName;
      })[0] || {};

    let dataModelId = model.id;

    // find container
    let containerOpt = { key: 'name' };
    let container = findById(page, 'main', containerOpt);
    let containerPath = pagePath + '.' + containerOpt.path.join('.');

    // find table
    let tableOpt = { key: 'name' };
    let table = findById(page, 'table', tableOpt);
    let tablePath = pagePath + '.' + tableOpt.path.join('.');

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

const addToSidebar = async (node, page, cx) => {
  let modelName = node.name;
  let opt = { key: 'name' };
  let sidebar = findById(cx.state(), 'sidebar', opt);
  let sidebarPath = opt.path.join('.');

  if (!sidebar) {
    return;
  }

  // find menu
  let menuOpt = { key: 'type' };
  let menu = findById(sidebar, 'menu', menuOpt);
  let menuPath = sidebarPath + '.' + menuOpt.path.join('.');

  // console.log(menuPath);

  if (findById(menu, page.route, { key: 'path' })) {
    return;
  }

  let children = menu.children || [];
  let menuItem = cx.createNode({
    type: 'menuItem',
    path: page.route,
    label: page.name,
  });

  children.push(menuItem);

  cx.setState({
    [`${menuPath}.children`]: children,
  });
};

const generate = async (node, cx) => {
  let detailPage = await addDetailPage(node, cx);
  await addDetailFields(node, detailPage, cx);

  let listPage = await addListPage(node, cx);
  await addListFields(node, listPage, cx);

  await addToSidebar(node, listPage, cx);
};

export default generate;
