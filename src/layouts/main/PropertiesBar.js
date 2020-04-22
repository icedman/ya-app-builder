import React from 'react';

import { useUI } from 'stores/UIStore';
import { useApp } from 'stores/AppStore';

function PropertiesBar(props) {
  const ui = useUI();
  const app = useApp();

  return <div>PropertiesBar</div>;
}

export default PropertiesBar;
