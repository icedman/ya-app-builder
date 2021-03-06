import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from './RenderRegistry';

import './view';
import './menu';
import './elements';
import './form';
import './table';

import './custom';

export default function App(props) {
  const app = useApp();
  return (
    <div>
      App
      <pre>{JSON.stringify(app.state, null, 4)}</pre>
    </div>
  );
}
