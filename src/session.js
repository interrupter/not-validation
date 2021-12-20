const ValidationResult = require('./result');
const {notValidationError} = require('not-error');

const executeObjectFunction = require('./common.js');

const ValidationSession = async (validators, data)=>{
  const result = ValidationResult.getDefaultResult(data);
  await validateFields({validators, data, result});
  await validateForm({validators, data, result});
  return new ValidationResult(result);
};

module.exports = ValidationSession;

const validateFields = async ({validators, data, result})=>{
  for(let t in data){
    await validateField(t, data[t], validators, result);
  }
};

const validateField = async (fieldName, value, validators, result) => {
  const fieldValidators = getFieldValidators(fieldName, validators);
  return await runFieldValidators(fieldName, value, fieldValidators, result);
};

const getFieldValidators = (name, validators)=>{
  return validators && validators.fields && validators.fields[name]?validators.fields[name]:[];
};

const runFieldValidators = async (fieldName, value, validators, result) => {
  for(let validatorRule of validators){
    try{
      const valid = await executeObjectFunction(validatorRule['validator'], [value]);
      if(!valid){
        setFieldError(fieldName, validatorRule.message, result);
      }
    }catch(e){
      setFieldError(fieldName, validatorRule.message, result);
    }
  }
};

const setFieldError = (fieldName, errorMessage, result) => {
  if (!Array.isArray(result.fields[fieldName])){
    result.fields[fieldName] = [];
  }
  if(!result.fields[fieldName].includes(errorMessage)){
    result.fields[fieldName].push(errorMessage);
  }
  setDirty(result);
};

const setDirty = (result) => {
  result.clean = false;
};

const validateForm = async ({validators, data, result}) => {
  const formValidators = getFormValidators(validators);
  await runFormValidators(data, formValidators, result);
};

const getFormValidators = (validators)=>{
  return validators && validators.form?validators.form: [];
};

const runFormValidators = async (data, formValidators, result) => {
  for(let validator of formValidators){
    try{
      await validator(data);
    }catch(e){
      if(e instanceof notValidationError){
        const formErrors = e.getFieldsErrors();
        addFormErrors(formErrors.form, result);
        addFormFieldsErrors(formErrors.fields, result);
      }else{
        throw e;
      }
    }
  }
};

const addFormErrors = (errors, result) => {
  errors.forEach(error => {
    addFormError(error, result);
  });
};

const addFormError = (errorMessage, result) => {
  if(!result.form.errors.includes(errorMessage)){
    result.form.errors.push(errorMessage);
  }
  setDirty(result);
};

const addFormFieldsErrors = (fieldsErrors, result)=>{
  for(let fieldName in fieldsErrors){
    addFormFieldErrors(fieldName, fieldsErrors[fieldName], result);
  }
};

const addFormFieldErrors = (fieldName, errorMessages, result) => {
  if (!Array.isArray(result.form.fields[fieldName])){
    result.form.fields[fieldName] = [...errorMessages];
    setDirty(result);
  }else{
    errorMessages.forEach(error => {
      addFormFieldError(fieldName, error, result);
    });
  }
};

const addFormFieldError = (fieldName, errorMessage, result) => {
  if(!result.form.fields[fieldName].includes(errorMessage)){
    result.form.fields[fieldName].push(errorMessage);
  }
  setDirty(result);
};
