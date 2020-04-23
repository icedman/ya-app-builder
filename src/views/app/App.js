import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from './RenderRegistry';

import './view';
import './menu';
import './elements';
import './form';

export default function App(props) {
  const app = useApp();
  return (
    <div>
      Page
      <pre>{JSON.stringify(app.state, null, 4)}</pre>
    </div>
  );
}
