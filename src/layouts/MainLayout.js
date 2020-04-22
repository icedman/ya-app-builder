import React from 'react';
import { useUI } from 'stores/UIStore';
import Topbar from './main/Topbar';
import Sidebar from './main/Sidebar';

import RenderRegistry from 'views/app/RenderRegistry';

export default (props) => {
  const ui = useUI();
  let node = props.node;

  return (
    <div style={{ display: 'flex', paddingLeft: '320px', paddingTop: '80px' }}>
      <Topbar />
      <Sidebar />
      <main style={{ flex: 1 }}>
        {node ? <RenderRegistry.Render node={node} /> : props.children}
      </main>
    </div>
  );
};
