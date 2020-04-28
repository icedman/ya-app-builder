import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import events from 'libs/events';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import { findById } from 'libs/utility';
import DataModel from '../data/DataModel';

const cachedStates = {};
const nullDataModel = new DataModel('');

const Page = withRouter((props) => {
  const app = useApp();

  const [state, setState] = React.useState({
    data: { _isNull: true },
  });

  let node = findById(app.state, props.node.id, { key: 'id' }) || {};
  let name = node.name || node.id;

  const renderChildren = RenderRegistry.renderChildren;

  let context;
  let routePath;

  let model = node.dataModel;
  if (model) {
    let modelDef = (app.state.children || []).filter((c) => {
      return c.type === 'model' && c.id === model;
    })[0];

    if (modelDef) {
      context = cachedStates[node.id] || new DataModel(modelDef.name);
      cachedStates[node.id] = context;
      context.useState(state, setState);

      routePath = modelDef.name;
    }
  }

  React.useEffect(() => {
    if (model && state.data._isNull) {
      fetchData({});
    }
  }, [model]);

  const fetchData = (params) => {
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

    context
      .find(params)
      .then((res) => {
        context.setState({
          data: res.data,
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onNew = async (params) => {
    props.history.push(`/${routePath}/0`);
    context.setState({
      data: {},
    });
  };

  const onOpen = async (params) => {
    console.log(routePath);
    props.history.push(`/${routePath}/${params._id}`);
    context.setState({
      data: {},
    });
  };

  const onSave = async (params) => {
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

  React.useEffect(() => {
    events.$on('open', onOpen);
    events.$on('new', onNew);
    events.$on('save', onSave);
    events.$on('delete', onDelete);
    return () => {
      events.$off('open', onOpen);
      events.$off('new', onNew);
      events.$off('save', onSave);
      events.$off('delete', onDelete);
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
