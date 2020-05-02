export function isChecked(val) {
  if (!val) {
    return { error: 'isChecked', message: 'Field must be checked' };
  }
}

export function isEmail(val) {
  const regex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  if (val && !regex.exec(val)) {
    return { error: 'isEmail', message: 'Not a valid email address' };
  }
}

export function isAlpha(val) {
  const regex = /^[a-zA-Z]*$/;
  if (val && !regex.exec(val)) {
    return { error: 'isAlpha', message: 'Not a alpha' };
  }
}

export function isAlphaNumeric(val) {
  const regex = /^[a-zA-Z0-9]*$/;
  if (val && !regex.exec(val)) {
    return { error: 'isAlphaNumeric', message: 'Not alpha numeric' };
  }
}

export function isNumeric(val) {
  const regex = /^[0-9]*$/;
  if (val && !regex.exec(val)) {
    return { error: 'isNumeric', message: 'Not numeric' };
  }
}

export function isDecimal(val) {
  const regex = /^[-]?\d*(\.\d+)?$/;
  if (val && !regex.exec(val)) {
    return { error: 'isDecimal', message: 'Not a decimal' };
  }
}

export function isInteger(val) {
  const regex = /^-?[0-9]*$/;
  if (val && !regex.exec(val)) {
    return { error: 'isInteger', message: 'Not an integer' };
  }
}

export function isRequired(val) {
  if (!val) {
    return { error: 'isRequired', message: 'Field cannot be empty' };
  }
}

export function isUrl(val) {
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  if (val && !regex.exec(val)) {
    return { error: 'isUrl', message: 'Not a valid url' };
  }
}
