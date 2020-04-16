import React from 'react';

import Registry, { PreviewRegistry } from '../Registry';

Registry.add({
  project: {
    children: {
      showInTree: false,
      types: ['view', 'model'],
    },
    preview: 'Project',
  }
});

PreviewRegistry.add({
    Project: (props) => {
    return <div>The Project</div>;
  }
})