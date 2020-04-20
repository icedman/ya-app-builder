import React from 'react';
import merge from 'merge';
import config from 'config/config.js';
import http from 'libs/http.js';
import cache, { session } from 'libs/cache.js';
import events from 'libs/events.js';

import { mutateState } from 'libs/utility';

export const Store = React.createContext();

function setSession(user) {
  cache.put('user', user, {
    persist: true,
  });
  session.put('user', user, {
    persist: true,
  });

  // console.log('save');
  // console.log('-------------');
  // console.log(JSON.stringify(user, null, 4));

  delete http.defaults.headers.common['Authorization'];
  if (user && user.jwt) {
    http.defaults.headers.common['Authorization'] = 'Bearer ' + user.jwt; // strapi token
  } else {
    delete http.defaults.headers.common['Authorization'];
  }

  events.$emit('user-authenticated', user);
}

export function setUser(user) {
  return {
    type: 'SET_USER',
    user: user,
  };
}

/* params: { path:value } */
export function setState(params) {
  return {
    type: 'SET_STATE',
    ...params,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      let user = action.user || {};
      setSession(user);
      return {
        ...state,
        ...user,
      };
    case 'SET_STATE':
      let params = {
        ...action,
      };
      delete params.type;
      state = mutateState(state, params);
      return {
        ...state,
      };
    default:
      return state;
  }
}

let defaultState = {
  user: {},
  ...session.get('user', {}),
};

// console.log('default state -- from session');
// console.log('-------------');
// console.log(JSON.stringify(defaultState, null, 4));

// try to restore session
if (!defaultState.jwt) {
  if (
    document.referrer.length &&
    document.location.href.indexOf(document.referrer) !== -1
  ) {
    defaultState = {
      ...cache.get('user', {}),
    };

    // console.log('default state -- from cache');
    // console.log('-------------');
    // console.log(JSON.stringify(defaultState, null, 4));

    session.put('user', defaultState, {
      persist: true,
    });
  }
} else {
  cache.put('user', defaultState, {
    persist: true,
  });
}

defaultState.user = defaultState.user || {};

if (defaultState.jwt) {
  // validate jwt
  http.defaults.headers.common['Authorization'] = 'Bearer ' + defaultState.jwt;

  // acquire server jwt
  http
    .get(config.app.server.url + '/users/me')
    .then((res) => {
      console.log('session token verified');
      events.$emit('user-authenticated', defaultState.user);
    })
    .catch((err) => {
      console.log('token has expired');
      delete http.defaults.headers.common['Authorization'];
      cache.get(
        'user',
        {},
        {
          persist: true,
        }
      );
      session.put(
        'user',
        {},
        {
          persist: true,
        }
      );
      defaultState = {
        user: session.get('user', {}),
      };
    });
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(
    reducer,
    merge.recursive(defaultState)
  );
  const value = {
    state,
    dispatch,
    setState,
    setUser,
  };
  return <Store.Provider value={value}> {props.children} </Store.Provider>;
}

export function useAuth() {
  return React.useContext(Store);
}
