const ValidationSession = require('./session.js');

const ValidationRunner = (validatorsLib) => {
  return (data, formName) => {
    const validators = {
      fields: getFieldsValidators(data, validatorsLib),
      form: getFormValidators(formName, validatorsLib),
    };
    return ValidationSession(validators, data);
  };
};

module.exports = ValidationRunner;

const getFieldsValidators = (data, validatorsLib) => {
  if (validatorsLib && validatorsLib.fields) {
    const list = Object.keys(data);
    const result = {};
    list.forEach((fieldName) => {
      if (Array.isArray(validatorsLib.fields[fieldName])) {
        result[fieldName] = validatorsLib.fields[fieldName];
      }
    });
    return result;
  } else {
    return {};
  }
};

const getFormValidators = (name, validatorsLib) => {
  return (validatorsLib && validatorsLib.forms && validatorsLib.forms[name]) ? validatorsLib.forms[name] : [];
};
