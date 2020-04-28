import React from 'react';
import merge from 'merge';
import { mutateState, injectId } from 'libs/utility';
import $config from 'config/config';
import cache from 'libs/cache';

export const Store = React.createContext();

let lastState = cache.get('last-state') || {};

const initialState = {
  sidebar: { uuid: 'sidebar', component: 'Sidebar', items: [] },
  topbar: { items: [] },
  location: {},
  notifications: [],
  mobile: $config.app.mobile || false,
  _state: lastState,
};

/* params: { path:value } */
export function setState(params) {
  return {
    type: 'SET_STATE',
    ...params,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      let params = { ...action };
      delete params.type;
      state = mutateState(state, params);

      cache.put('last-state', state._state, { persist: true });

      return { ...state };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const config = merge.recursive(initialState, props.config || {});
  injectId(config);
  const [state, dispatch] = React.useReducer(reducer, config);
  const value = { state, dispatch, setState };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export function useUI() {
  return React.useContext(Store);
}
