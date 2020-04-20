import React from 'react';
import { useUI } from 'stores/UIStore';

export default (props) => {
  const ui = useUI();

  return <div>{props.children}</div>;
};
