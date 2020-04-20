import React from 'react';

export default function Nav(props) {
  const onSave = () => {
    props.context.save();
  };

  const onLoad = () => {
    props.context.load();
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
              <a className="button is-primary" onClick={onSave}>
                <strong>Save</strong>
              </a>
              <a className="button is-light" onClick={onLoad}>
                Load
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
