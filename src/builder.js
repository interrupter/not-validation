const objHas = (obj, name) => {
  return Object.prototype.hasOwnProperty.call(obj, name);
};
const {
  augmentFieldsValidators,
  augmentFormValidators,
} = require('./builder.utils');

module.exports = (validators, getValidatorEnv) => {
  if(typeof validators === 'undefined' || validators === null){return {};}
  if (objHas(validators, 'fields')) {
    transformFieldsValidators(validators.fields, getValidatorEnv);
  }
  if (objHas(validators, 'forms')) {
    transformFormsValidators(validators.forms, getValidatorEnv);
  }else{
    if (objHas(validators, 'form')) {
      validators.form = augmentFormValidators(validators.form, getValidatorEnv);
    }
  }
  return validators;
};

const transformFieldsValidators = (fields, getValidatorEnv)=>{
  for (let fieldName in fields) {
    if(Array.isArray(fields[fieldName])){
      fields[fieldName] = augmentFieldsValidators(fields[fieldName], getValidatorEnv);
    }
  }
};

const transformFormsValidators = (formsValidators, getValidatorEnv)=>{
  for (let formName in formsValidators) {
    if(Array.isArray(formsValidators[formName])){
      formsValidators[formName] = augmentFormValidators(formsValidators[formName], getValidatorEnv);
    }
  }
};
