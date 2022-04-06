const objHas = (obj, name) => {
  return Object.prototype.hasOwnProperty.call(obj, name);
};
const {
  augmentFieldsValidators,
  augmentFormValidators,
} = require('./builder.utils');

module.exports = (validators, getValidatorEnv) => {
  if(typeof validators === 'undefined' || validators === null){return {};}
  const augmented = {};
  if (objHas(validators, 'fields')) {
    augmented.fields = transformFieldsValidators(validators.fields, getValidatorEnv);
  }
  if (objHas(validators, 'forms')) {
    augmented.forms = transformFormsValidators(validators.forms, getValidatorEnv);
  }else{
    if (objHas(validators, 'form')) {
      augmented.form = augmentFormValidators(validators.form, getValidatorEnv);
    }
  }
  return augmented;
};

const transformFieldsValidators = (fields, getValidatorEnv)=>{
  const augmented = {};
  for (let fieldName in fields) {
    if(Array.isArray(fields[fieldName])){
      augmented[fieldName] = augmentFieldsValidators(fields[fieldName], getValidatorEnv);
    }
  }
  return augmented;
};

const transformFormsValidators = (formsValidators, getValidatorEnv)=>{
  const augmented = {};
  for (let formName in formsValidators) {
    if(Array.isArray(formsValidators[formName])){
      augmented[formName] = augmentFormValidators(formsValidators[formName], getValidatorEnv);
    }
  }
  return augmented;
};
