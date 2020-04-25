import React from 'react';
import merge from 'merge';
import { mutateState, injectId, guid } from 'libs/utility';
import cache from 'libs/cache';

export const Store = React.createContext();

let projectId = cache.get('last-project') || 'project-default';
let state = cache.get(projectId) || {};

const initialState = {
  id: guid(),
  type: 'project',
  ...state,
  routes: generateRoutes(state),
  _state: {},
};

function generateRoutes(state) {
  console.log('generateRoutes');
  let routes = [];
  if (state) {
    let pages = (state.children || []).filter((p) => {
      return p.type === 'page';
    });
    routes = pages.map((p) => {
      return {
        name: p.name,
        path: p.route,
        node: {
          _id: p.id,
          type: p.type,
        },
        component: (props) => <pre>{JSON.stringify(props, null, 4)}</pre>,
      };
    });
  }
  return routes;
}

/* params: { path:value } */
export function setState(params) {
  return {
    _type: 'SET_STATE',
    ...params,
  };
}

export function regenerateRoutes(params) {
  return {
    _type: 'GEN_ROUTES',
    ...params,
  };
}

export function reducer(state, action) {
  let params = { ...action };
  switch (action._type) {
    case 'SET_STATE':
      delete params._type;
      state = mutateState(state, params);
      return {
        ...state,
      };
    case 'GEN_ROUTES':
      return {
        ...state,
        routes: generateRoutes(params),
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const config = merge.recursive(initialState, props.config || {});
  const [state, dispatch] = React.useReducer(reducer, config);
  const value = { state, dispatch, setState, regenerateRoutes };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export function useApp() {
  return React.useContext(Store);
}
