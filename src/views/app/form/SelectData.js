import React from 'react';
import Select from './Select';
import crud from 'common/crud';
import cache from 'common/cache';
import pluralize from 'pluralize';

import StateHelper from 'common/stateHelper';

const DataSelect = (props) => {
  let value;
  if (props.context) {
    value = props.context.getState(props.model);
  }
  if (value && typeof value === 'object') {
    value = value._id || value.id;
  }

  const [state, setState] = React.useState({ value: value, options: [] });
  const sourceModel = pluralize(props.source, 2);
  const $data = crud(sourceModel);

  const fs = new StateHelper();
  fs.useState(state, setState);

  React.useEffect(() => {
    let v = state.options.filter((opt) => opt.value === state.value)[0] || {};
    if (props.context) {
      props.context.setState({
        [props.model]: v.data,
      });
    }
  }, [state.value]);

  React.useEffect(() => {
    if (props.context) {
      fs.setState({
        value: value,
      });
    }
  }, [value]);

  const fetchData = async () => {
    let res = await cache.request(props.source, () => {
      return $data.find({});
    });

    setState({
      ...state,
      options: (res || []).map((d) => {
        return {
          value: d._id || d.id,
          label: d.title || d.label || d.name || d.description || d.id || d._id,
          data: d,
        };
      }),
    });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Select {...props} options={state.options} context={fs} model="value" />
  );
};

export default DataSelect;
