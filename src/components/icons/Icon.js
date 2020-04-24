import React, { Fragment } from 'react';
// import { FontAwesomeIcon as TheFontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library as faLibrary } from './registry_fontawesome';
import { library as muiLibrary } from './registry_mui';

function IconWrapper(props) {
  if (!props.icon) {
    console.warn('icon invalid');
    return <Fragment></Fragment>;
  }

  let icon = props.icon || {};

  // query registry
  if (typeof icon === 'string') {
    icon = Library[icon];
  }

  if (React.isValidElement(icon)) {
    return icon;
  }

  // catch mui
  if (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon.type && icon.type.render)
  ) {
    let Icon = icon;
    return <Icon {...props} />;
  }

  // catch fontawesome
  if (!icon || !icon.prefix || icon.prefix.indexOf('fa') !== 0) {
    if (props.icon !== 'no-icon') {
      // console.warn('icon not found - ' + props.icon);
    }
    return <Fragment></Fragment>;
  }

  return <Fragment></Fragment>;
  // return <TheFontAwesomeIcon {...props} icon={icon} />;
}

export const FontAwesomeIcon = IconWrapper;

export default IconWrapper;

export const Library = {
  ...faLibrary,
  ...muiLibrary,
};

delete Library.add;
