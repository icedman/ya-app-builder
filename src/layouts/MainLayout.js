import React from 'react';
import { useUI } from 'stores/UIStore';
import Sidebar from './main/Sidebar';

export default (props) => {
  const ui = useUI();

  return (
    <div style={{ display: 'flex' }}>
      <aside>
        <Sidebar />
      </aside>
      <main style={{ flex: 1 }}>{props.children}</main>
    </div>
  );
};
