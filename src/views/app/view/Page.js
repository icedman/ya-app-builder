import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import events from 'libs/events';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import { findById } from 'libs/utility';
import DataModel from '../data/DataModel';
import debounce from 'debounce';
import pluralize from 'pluralize';

const cachedContext = {};
const nullDataModel = new DataModel({});

const Page = withRouter((props) => {
  const app = useApp();

  const [state, setState] = React.useState({
    data: {},
  });

  let node = findById(app.state, props.node.id, { key: 'id' }) || {};
  let name = node.name || node.id;

  const renderChildren = RenderRegistry.renderChildren;

  let context;
  let routePath;

  let model = node.dataModel;
  let modelName = 'data';
  let modelDef;
  if (model) {
    modelDef = (app.state.children || []).filter((c) => {
      return c.type === 'model' && c.id === model;
    })[0];
  }

  if (modelDef) {
    context = cachedContext[node.id] || new DataModel(modelDef);
    cachedContext[node.id] = context;

    context.useState(state, setState);
    routePath = pluralize(modelDef.name);
  }

  // todo validation

  React.useEffect(() => {
    if (model && !state.data._id) {
      fetchData({});
    }
  }, [model]);

  const fetchData = async (params) => {
    if (props.match) {
      params = {
        ...props.match.params,
        ...params,
      };

      if (params.id === '0') {
        delete params.id;
        context.setState({
          data: {},
        });
        return;
      }
    }

    if (params && params.filter && modelDef) {
      let filter = { ...params.filter };
      delete params.filter;

      if (filter.search) {
        modelDef.children.forEach((c) => {
          if (c.type.indexOf('field') === 0) {
            params[`or:${c.name}_regex`] = filter.search;
          }
        });
        delete filter.search;
      }

      params = { ...params, ...filter };
    }

    context
      .find(params)
      .then((res) => {
        context.setState({
          [`data`]: res.data,
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFilter = debounce(async (params) => {
    fetchData({
      filter: params,
    });
  }, 50);

  const onNew = async (params) => {
    props.history.push(`/${routePath}/0`);
    context.setState({
      data: {},
    });
  };

  const onOpen = async (params) => {
    props.history.push(`/${routePath}/${params._id}`);
    context.setState({
      data: {},
    });
  };

  const onSave = async (params) => {
    await context.validateState();

    if (context.hasErrors()) {
      return;
    }

    let res = await context.save();
    context.setState({
      data: res.data,
    });
    props.history.replace(`/${routePath}/${res.data.id}`);
  };

  const onDelete = async (params) => {
    await context.erase();
    props.history.replace(`/${routePath}-list`);
  };

  const pageEvents = {
    open: onOpen,
    new: onNew,
    save: onSave,
    delete: onDelete,
    filter: onFilter,
  };

  React.useEffect(() => {
    events.register(pageEvents);
    return () => {
      events.unregister(pageEvents);
    };
  });

  return (
    <div>
      {node.dataModel ? JSON.stringify(state) : ''}
      {RenderRegistry.renderChildren(node.children, {
        // ...props,
        context,
      })}
    </div>
  );
});

RenderRegistry.add({
  page: Page,
});
