import React from 'react';
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.toLowerCase().charAt(0).toUpperCase() + s.slice(1);
};

export function Column(props) {
  // console.log(`${props.row}-${props.column}`)
  let columnsRendered = props.value;
  if (typeof props.children === 'function') {
    columnsRendered = props.children(props);
  } else {
    columnsRendered = props.children;
  }
  if (!columnsRendered) {
    columnsRendered =
      typeof props.value === 'object'
        ? JSON.stringify(props.value)
        : props.value;
  }
  const onClick = props.onClick || (() => {});
  return (
    <TableCell
      onClick={(evt) => {
        onClick(evt, props);
      }}
    >
      {columnsRendered}
    </TableCell>
  );
}

export function HeaderColumn(props) {
  return Column({ ...props, value: props.meta.label });
}

export function FooterColumn(props) {
  return Column({ ...props });
}

export function Row(props) {
  let elementMap = {};
  React.Children.toArray(props.templates).forEach((child) => {
    elementMap[child.props.field] = child;
  });

  // sanitize columns
  let columns = props.columns.map((column) => {
    let name = column.name || column;
    let label = capitalize(column.label || name);
    if (/(\$start|\$end)/.exec(label)) {
      label = '';
    }
    return typeof column === 'column' ? column : { name: name, label: label };
  });

  let columnsRendered = columns.map((col, idx) => {
    let value = props.data[col.name];

    let componentProps = {
      key: `column-${idx}`,
      row: props.row,
      column: idx,
      meta: col,
      value: value,
      data: props.data,
      context: props.context || {},
    };

    if (elementMap[col.name]) {
      return React.cloneElement(elementMap[col.name], componentProps);
    }

    let Component = props.defaultColumn || Column;
    return <Component {...componentProps} />;
  });

  const onClick = props.onClick || (() => {});
  return (
    <TableRow
      hover={props.hover}
      onClick={(evt) => {
        onClick(evt, props);
      }}
    >
      {columnsRendered}
    </TableRow>
  );
}

export function Header(props) {
  return (
    <TableHead className={props.className}>
      <Row {...props} data={[{}]} defaultColumn={HeaderColumn} />
    </TableHead>
  );
}

// footer is still todo
export function Footer(props) {
  return (
    <tfoot>
      <Row {...props} data={[{}]} defaultColumn={FooterColumn} />
    </tfoot>
  );
}

function rowPropsAreEqual(prevProps, nextProps) {
  const fieldsToCheck = ['data'];
  for (let i = 0; i < fieldsToCheck.length; i++) {
    let f = fieldsToCheck[i];
    let prevObj = prevProps[f];
    let nextObj = nextProps[f];
    if (prevObj != nextObj) {
      return false;
    }
  }
  return true;
}

const RowMemo = React.memo(Row, rowPropsAreEqual);

export function Body(props) {
  let R = Row;
  if (props.options.memo) {
    R = RowMemo;
  }
  let rowsRendered = props.data.map((row, idx) => {
    return <R {...props} key={`row-${idx}`} row={idx} data={row} />;
  });

  return <TableBody className={props.className}>{rowsRendered}</TableBody>;
}

export function Table(props) {
  let options = props.options || {};
  let elementsRendered = [];
  React.Children.toArray(props.children).forEach((child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    elementsRendered.push(
      React.cloneElement(child, {
        ...props,
        templates: child.props.children,
        className: child.props.className,
        options: options,
      })
    );
  });

  if (!elementsRendered.filter((elm) => elm.type.name === 'Body').length) {
    elementsRendered.push(<Body key={0} {...props} options={options} />);
  }

  return <MUITable className={props.className}>{elementsRendered}</MUITable>;
}
