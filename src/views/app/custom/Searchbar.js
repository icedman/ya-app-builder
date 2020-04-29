import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import StateHelper from 'libs/stateHelper';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import events from 'libs/events';

const cx = new StateHelper();

const Searchbar = (props) => {
  const [state, setState] = React.useState({
    data: {
      search: '',
    },
  });

  cx.useState(state, setState);

  let node = props.node;

  React.useEffect(() => {
    events.$emit('filter', state.data);
  }, [state.data.search]);

  return (
    <div>
      The Searchbar {JSON.stringify(state)}
      {RenderRegistry.renderChildren(node.children, { ...props, context: cx })}
    </div>
  );
};

RenderRegistry.add({
  Searchbar,
});
