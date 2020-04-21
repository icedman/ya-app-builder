import React from 'react';

import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

function Sidebar(props) {
  const ui = useUI();
  const app = useApp();

  // find sidebar
  let sidebar =
    app.state.children.filter((s) => {
      return s.name === 'sidebar';
    })[0] || {};

  return (
    <div>
      Sidebar
      <pre>{JSON.stringify(sidebar, null, 4)}</pre>
    </div>
  );
}

export default Sidebar;
