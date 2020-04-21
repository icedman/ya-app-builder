import React from 'react';
import { useApp } from 'stores/AppStore';
import cache from 'libs/cache';
import RenderRegistry from './RenderRegistry';

function renderChildrenPreview(children, props) {
  return (children || []).map((node, idx) => {
    return <Preview {...props} className="" node={node} key={`cp-${idx}`} />;
  });
}

const Sidebar = (props) => {
  return <div>Sidebar</div>;
};

const Page = (props) => {
  return <div>Page</div>;
};

const View = (props) => {
  return <div>View</div>;
};

const Render = (props) => {
  return <div>Render</div>;
};

RenderRegistry.add({
  Sidebar: Sidebar,
  Page: Page,
});

export default function App(props) {
  const app = useApp();

  return (
    <div>
      Page
      <pre>{JSON.stringify(app.state, null, 4)}</pre>
    </div>
  );
}
