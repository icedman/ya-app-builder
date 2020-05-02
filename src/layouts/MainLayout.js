import React, { useState } from 'react';
import { useUI } from 'stores/UIStore';
import Topbar from './main/Topbar';
import Sidebar from './main/Sidebar';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import RenderRegistry from 'views/app/RenderRegistry';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64,
    },
  },
  shiftContent: {
    paddingLeft: 240,
  },
  content: {
    height: '100%',
  },
}));

export default (props) => {
  const ui = useUI();
  let node = props.node;

  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop,
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {node ? <RenderRegistry.Render node={node} /> : props.children}
      </main>
    </div>
  );

  // return (
  //   <div
  //     style={{ display: 'flex', paddingLeft: sidebarWidth, paddingTop: '80px' }}
  //   >
  //     <Topbar />
  //     <Sidebar sidebarWidth={sidebarWidth} />
  //     <main style={{ flex: 1 }}>
  //       {node ? <RenderRegistry.Render node={node} /> : props.children}
  //     </main>
  //   </div>
  // );
};
