import React, { Suspense } from 'react';
import { HashRouter as TheRouter } from 'react-router-dom';
import Routes from './Routes';

import './assets/_app.css';
import theme from './theme';

import { ThemeProvider } from '@material-ui/styles';
import { StoreProvider as AuthProvider } from 'stores/AuthStore';
import { StoreProvider as UIProvider } from 'stores/UIStore';
import { StoreProvider as AppProvider } from 'stores/AppStore';

function App() {
  return (
    <div className="App">
      {/* prettier-ignore */}
      <ThemeProvider theme={theme}>
      <AppProvider>
      <UIProvider>
        <TheRouter>
        <Suspense fallback={<div></div>}>
          <Routes />
        </Suspense>
        </TheRouter>
      </UIProvider>
      </AppProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
