import React, { Suspense } from 'react';
import { HashRouter as TheRouter } from 'react-router-dom';
import Routes from './Routes';

import './assets/_app.css';

import { StoreProvider as AuthProvider } from 'stores/AuthStore';
import { StoreProvider as UIProvider } from 'stores/UIStore';
import { StoreProvider as AppProvider } from 'stores/AppStore';

function App() {
  return (
    <div className="App">
      {/* prettier-ignore */}
      <AppProvider>
      <UIProvider>
        <TheRouter>
        <Suspense fallback={<div></div>}>
          <Routes />
        </Suspense>
        </TheRouter>
      </UIProvider>
      </AppProvider>
    </div>
  );
}

export default App;
