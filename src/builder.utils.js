
const augmentFieldsValidators = (fieldValidators, getValidatorEnv) => {
  return fieldValidators.map(fieldRule => augmentFieldValidator(fieldRule, getValidatorEnv));
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


module.exports = {
  augmentFieldsValidators,
  augmentFieldValidator,
  augmentFormValidators,
  augmentFormValidator
};
