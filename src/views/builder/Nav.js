import React from 'react';
import { withRouter } from 'react-router-dom';
import { useApp } from 'stores/AppStore';

export default withRouter((props) => {
  const app = useApp();

  const onSave = () => {
    props.context.save();
  };

  const onLoad = () => {
    props.context.load();
  };

  const onRun = () => {
    let state = props.context.state();
    props.context.save();

    app.dispatch(app.regenerateRoutes(state));

    setTimeout(() => {
      props.history.push('/app');
    }, 0);
  };

  return (
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
      style={props.style}
    >
      <div className="navbar-brand">
        <a className="navbar-item">
          <b>App Builder</b>
        </a>

        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          {/*
          <a className="navbar-item">Documentation</a>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">More</a>

            <div className="navbar-dropdown">
              <a className="navbar-item">About</a>
              <a className="navbar-item">Jobs</a>
              <a className="navbar-item">Contact</a>
              <hr className="navbar-divider" />
              <a className="navbar-item">Report an issue</a>
            </div>
          </div>
          */}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-light" onClick={onSave}>
                <strong>Save</strong>
              </a>
              <a className="button is-light" onClick={onLoad}>
                <strong>Reload</strong>
              </a>
              <a className="button is-danger" onClick={onRun}>
                <strong>Run</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});
