import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from '../RenderRegistry';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import events from 'libs/events';

import { Table, Header, Body } from 'components/table/Table';

const Element = withRouter((props) => {
  let node = props.node;
  let columns = [];

  node.children.forEach((c) => {
    if (c.type !== 'column') {
      return;
    }

    columns.push({
      name: c.name,
      label: c.label || c.name,
    });
  });

  let data = props.context.getState('data');
  if (!data || !data.length) {
    data = [];
  }

  const onRowClick = (evt, row) => {
    events.$emit('open', row.data);
  };

  return (
    <Table columns={columns} data={data}>
      <Header></Header>
      <Body onClick={onRowClick} hover={true} />
    </Table>
  );
});

RenderRegistry.add({
  table: Element,
});
