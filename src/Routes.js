import React, { Fragment } from 'react';
import { Switch, Redirect, withRouter } from 'react-router-dom';

import RouteWithLayout, {
  RouteWithAuthLayout,
} from 'components/misc/RouteWithLayout';

import App from 'views/app/App';
import Builder from 'views/builder/Builder';

import {
  Main as MainLayout,
  Minimal as MinimalLayout,
  Full as FullLayout,
} from './layouts';

import { useAuth } from 'stores/AuthStore';
import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

import path from 'path';

import $config from 'config/config';

const NotFoundView = () => {
  return <div>NotFoundView</div>;
};

const SignInView = () => {
  return <div>SignInView</div>;
};

const DashboardView = () => {
  const ui = useUI();

  return <div>DashboardView</div>;
};

const renderRoute = (config) =>
  config.routes.map((route, idx) => {
    const routePath = path.join(config.prefix || '', route.path || '');
    return (
      <RouteWithAuthLayout
        key={`${route.prefix}-route-${idx}`}
        component={route.component}
        exact
        node={{
          id: route.node.id,
          type: route.node.type,
        }}
        layout={route.layout || config.layout || MainLayout}
        path={routePath}
      />
    );
  });

const Routes = withRouter((props) => {
  const ui = useUI();
  const app = useApp();

  let routes = [];

  if (app.state && app.state.routes) {
    routes = [
      ...renderRoute({
        routes: app.state.routes || [],
      }),
    ];
  }

  return (
    <Switch>
      <Redirect exact from="/" to="/editor" />
      {routes}
      <RouteWithAuthLayout
        component={App}
        exact
        __requiresAuth
        layout={MainLayout}
        path="/app"
      />
      <RouteWithAuthLayout
        component={Builder}
        exact
        __requiresAuth
        layout={FullLayout}
        path="/editor"
      />
      <RouteWithAuthLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithAuthLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
});

export default Routes;
