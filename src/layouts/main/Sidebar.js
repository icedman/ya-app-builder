import React from 'react';
import { withRouter } from 'react-router-dom';
import { Divider, Drawer } from '@material-ui/core';

import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

import RenderRegistry from 'views/app/RenderRegistry';

function Sidebar(props) {
  const ui = useUI();
  const app = useApp();

  let open = true;
  let variant = 'persistent';

  // find sidebar
  let sidebar = {
    ...(app.state.children.filter((s) => {
      return s.type === 'menu';
    })[0] || {}),
  };

  sidebar.children = [...(sidebar.children || [])];
  sidebar.children.push({
    label: 'Back to Editor',
    path: '/',
    type: 'menuItem',
  });

  return (
    <Drawer
      anchor="left"
      // classes={{ paper: classes.drawer }}
      // onClose={onClose}
      open={open}
      variant={variant}
    >
      <div style={{ width: props.sidebarWidth }}>
        <RenderRegistry.Render node={sidebar} />
      </div>
    </Drawer>
  );
}

export default Sidebar;
