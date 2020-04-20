import React from 'react';
import merge from 'merge';
import { mutateState, injectId } from 'libs/utility';

export const Store = React.createContext();

const initialState = {};

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
      return { ...state };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const config = merge.recursive(initialState, props.config || {});
  const [state, dispatch] = React.useReducer(reducer, config);
  const value = { state, dispatch, setState };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export function useApp() {
  return React.useContext(Store);
}