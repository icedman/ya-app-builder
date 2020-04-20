import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { useAuth } from 'stores/AuthStore';

const RouteWithLayout = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

export const RouteWithAuthLayout = withRouter((props) => {
  const auth = useAuth();

  let { component, layout } = props;
  if (props.requiresAuth && (!auth.state.user || !auth.state.user.username)) {
    component = withRouter(() => {
      props.history.replace('/sign-in');
      return <div>No Access</div>;
    });
  }

  return <RouteWithLayout {...props} layout={layout} component={component} />;
});

export default RouteWithLayout;
