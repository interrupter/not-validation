const objHas = (obj, name) => Object.prototype.hasOwnProperty.call(obj, name);

const ValidationBuilder = (validators, getValidatorEnv) => {
  if (objHas(validators, 'fields')) {
    for (let fieldName in validators.fields) {
      validators.fields[fieldName] = augmentFieldsValidators(validators.fields[fieldName], getValidatorEnv);
    }
  }
  if (objHas(validators, 'forms')) {
    for (let formName in validators.forms) {
      validators.forms[formName] = augmentFormValidators(validators.forms[formName], getValidatorEnv);
    }
  }
  return validators;
};

module.exports = ValidationBuilder;

const augmentFieldsValidators = (fieldValidators, getValidatorEnv) => {
  return fieldValidators.map(field => augmentFieldValidator(field, getValidatorEnv));
};

const augmentFieldValidator = (rule, getValidatorEnv) => {
  if (rule.validator && typeof rule.validator === 'function') {
    const ruleValidator = rule.validator;
    const result = {
      ...rule
    };
    delete result.validator;
    result.validator = (val) => ruleValidator(val, getValidatorEnv());
    return result;
  }
  return rule;
};

const augmentFormValidators = (rules, getValidatorEnv) => {
  return rules.map(rule => augmentFormValidator(rule, getValidatorEnv));
};


const augmentFormValidator = (rule, getValidatorEnv) => {
  return (val) => rule(val, getValidatorEnv());
};
