import React from 'react';
import StateHelper from 'libs/stateHelper';
import crud from 'libs/crud';

class DataModel extends StateHelper {
  constructor(model) {
    super();
    this.crud = crud(model);
  }

  find(filter) {
    if (filter.id) {
      return this.crud.findOne(filter.id);
    }
    return this.crud.find(filter);
  }

  save() {
    return this.crud.save(this.getState('data'));
  }

  erase() {
    return this.crud.erase(this.getState('data.id'));
  }

  cancel() {
    this.crud.signal.cancel();
  }
}

export default DataModel;
