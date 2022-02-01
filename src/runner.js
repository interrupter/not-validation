const {
  composeFieldsValidators,
  composeFormValidators
} = require('./runner.utils.js');

const ValidationSession = require('./session.js');

const ValidationRunner = (validatorsLib) => {
  return (data, formName) => {
    const validators = {
      fields: composeFieldsValidators(data, validatorsLib),
      form: composeFormValidators(formName, validatorsLib),
    };
    return ValidationSession(validators, data);
  };
};

module.exports = ValidationRunner;
