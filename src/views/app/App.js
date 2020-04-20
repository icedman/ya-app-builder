import React from 'react';
import { useApp } from 'stores/AppStore';

export default function App(props) {
  const app = useApp();

  return (
    <div>
      <pre>{JSON.stringify(app.state, null, 4)}</pre>
    </div>
  );
}
