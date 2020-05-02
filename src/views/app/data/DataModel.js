import React from 'react';
import StateHelper from 'libs/stateHelper';
import crud from 'libs/crud';
import pluralize from 'pluralize';

/*
'string',
'text',
'number',
'boolean',
'date',
'email',
'password',
'json',
'file',
'enumeration',
'relation',
*/

import { isEmail, isRequired, isNumeric } from 'libs/validators';

class DataModel extends StateHelper {
  constructor(modelDef) {
    super();
    this.modelName = modelDef.name || '_model';
    this.crud = crud(pluralize(this.modelName));
    this.prepareValidation(modelDef);
  }

  prepareValidation(modelDef) {
    let validator = {
      data: {},
    };

    (modelDef.children || []).forEach((f) => {
      let k = f.name;
      validator.data[k] = validator.data[k] || {};
      if (k.dataType === 'email') {
        validator.data[k].email = isEmail;
      }
      if (f.dataType === 'number') {
        validator.data[k].number = isNumeric;
      }
      if (f.required) {
        validator.data[k].required = isRequired;
      }
    });

    this.useValidator(validator);
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
