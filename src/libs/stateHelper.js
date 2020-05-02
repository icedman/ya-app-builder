import { pathToValue, mutateState, guid } from './utility';

export default class StateHelper {
  updateKey = guid();
  fields = {};
  onChange = 'onChange';

  refresh() {
    this.fields = {};
    this.updateKey = guid();
    this.setState({ _errors: {} });
  }

  useState(state, setState) {
    this._state = state;
    this._setState = setState;
  }

  useContext(store, setState) {
    this._store = store;
    this._setState = setState;
  }

  useValidator(validator) {
    this.validator = { _options: {}, ...validator };
  }

  state() {
    if (this._store) {
      return this._store.state;
    }
    return this._state;
  }

  setState(newState) {
    // useState
    if (this._state && this._setState) {
      return this._setState(mutateState(this._state, newState));
    }

    // useContext
    if (this._store && this.setState) {
      return this._store.dispatch(this._setState(newState));
    }
  }

  getState(path) {
    if (!path) {
      return this.state();
    }
    return pathToValue(this.state(), path);
  }

  _onChange = (evt) => {
    let attributes = evt.target.attributes || {
      name: { value: evt.target.name },
    };
    let m = attributes.model || attributes.name;
    let model = m.value;
    let newState = {};
    newState[model] = evt.target.value;

    if (evt.target.type === 'checkbox') {
      newState[model] = evt.target.checked;
    }

    // this updates state errors
    newState._errors = this.validate(model, newState[model]);

    this.setState(newState);
  };

  model(model, opt = {}) {
    let res = {
      'data-update-key': this.updateKey,
      model: model,
      name: model,
    };

    let state = this.state();

    // validity
    if (this.validator) {
      let errors;
      if (state._errors) {
        errors = state._errors;
      }
      if (errors && errors[model]) {
        Object.assign(res, { ...errors[model] });
        res['data-last-error'] = res.error;
        res.error = res.error ? true : false;
      }
    }

    // event
    res[opt.onChange || this.onChange] = this._onChange;

    // value
    res[opt.value || 'value'] =
      pathToValue(state, model) || (opt.value === 'checked' ? false : '');

    // register this field
    this.fields[model] = true;
    return res;
  }

  validate(model, value) {
    if (!this.validator) {
      return {};
    }

    if (!model && !value) {
      return this.validateState();
    }

    let res = {};
    let state = this.state();

    let path = model.replace(/\.[0-9]*\./g, '.');
    let rules = pathToValue(this.validator, path);
    let keys = Object.keys(rules || {});
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let rule = rules[k];
      let test = rule;
      let msg;
      let err;
      if (typeof rule === 'object') {
        test = rule.test;
        msg = rule.message;
        err = rule.error;
      }
      if (typeof test === 'function') {
        let validity = test(value, { rule, state });
        if (validity) {
          Object.assign(res, {
            invalid: 'true',
            error: err || validity.error || msg || validity.message,
            message: msg || validity.message,
          });
          break;
        }
      }
    }

    let errors = state._errors || {};
    errors[model] = res;
    if (!res.invalid) {
      delete errors[model];
    }

    return errors;
  }

  validateState() {
    let state = this.state();

    let errors = {};

    Object.keys(this.fields).forEach((k) => {
      Object.assign(errors, this.validate(k, pathToValue(state, k)));
    });

    return this.setState({ _errors: errors });
  }

  hasErrors() {
    return Object.keys(this.state()._errors || {}).length;
  }
}
