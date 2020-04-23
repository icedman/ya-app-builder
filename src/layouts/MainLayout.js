import React from 'react';
import { useUI } from 'stores/UIStore';
import Topbar from './main/Topbar';
import Sidebar from './main/Sidebar';

import RenderRegistry from 'views/app/RenderRegistry';

const sidebarWidth = '300px';
export default (props) => {
  const ui = useUI();
  let node = props.node;

  return (
    <div
      style={{ display: 'flex', paddingLeft: sidebarWidth, paddingTop: '80px' }}
    >
      <Topbar />
      <Sidebar sidebarWidth={sidebarWidth} />
      <main style={{ flex: 1 }}>
        {node ? <RenderRegistry.Render node={node} /> : props.children}
      </main>
    </div>
  );
};
