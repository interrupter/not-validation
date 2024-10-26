const ValidationResult = require("./result");
const notVaildationError = require("not-error/src/validation.error.node.cjs");
const executeObjectFunction = require("./common.js");

const ValidationSession = async (validators, data) => {
    const result = ValidationResult.getDefaultResult(data);
    await validateFields({ validators, data, result });
    await validateForm({ validators, data, result });
    return new ValidationResult(result);
};

module.exports = ValidationSession;

const validateFields = async ({ validators, data, result }) => {
    for (let t in data) {
        await validateField(t, data[t], validators, result);
    }
};

const validateField = async (fieldName, value, validators, result) => {
    const fieldValidators = getFieldValidators(fieldName, validators);
    return await runFieldValidators(fieldName, value, fieldValidators, result);
};

const getFieldValidators = (name, validators) => {
    return validators && validators.fields && validators.fields[name]
        ? validators.fields[name]
        : [];
};

const runFieldValidators = async (fieldName, value, validators, result) => {
    for (let validatorRule of validators) {
        try {
            const valid = await executeObjectFunction(
                validatorRule["validator"],
                [value]
            );
            if (!valid) {
                setFieldError(fieldName, validatorRule.message, result);
            }
        } catch (e) {
            if (e instanceof notVaildationError || !validatorRule.message) {
                setFieldError(fieldName, e.message, result);
            } else {
                setFieldError(fieldName, validatorRule.message, result);
            }
        }
    }
};

const setFieldError = (fieldName, errorMessage, result) => {
    if (!result.fields[fieldName].includes(errorMessage)) {
        result.fields[fieldName].push(errorMessage);
    }
};

const validateForm = async ({ validators, data, result }) => {
    const formValidators = getFormValidators(validators);
    await runFormValidators(data, formValidators, result);
};

const getFormValidators = (validators) => {
    return validators && validators.form ? validators.form : [];
};

const runFormValidators = async (data, formValidators, result) => {
    for (let validator of formValidators) {
        try {
            await validator(data);
        } catch (e) {
            if (e && typeof e.getFieldsErrors === "function") {
                const formErrors = e.getFieldsErrors();
                Array.isArray(formErrors.form) &&
                    addFormErrors(formErrors.form, result);
                formErrors.fields &&
                    addFormFieldsErrors(formErrors.fields, result);
            } else {
                throw e;
            }
        }
    }
};

const addFormErrors = (errors, result) => {
    errors.forEach((error) => {
        addFormError(error, result);
    });
};

const addFormError = (errorMessage, result) => {
    if (!result.form.errors.includes(errorMessage)) {
        result.form.errors.push(errorMessage);
    }
};

const addFormFieldsErrors = (fieldsErrors, result) => {
    for (let fieldName in fieldsErrors) {
        addFormFieldErrors(fieldName, fieldsErrors[fieldName], result);
    }
};

const addFormFieldErrors = (fieldName, errorMessages, result) => {
    errorMessages.forEach((error) => {
        addFormFieldError(fieldName, error, result);
    });
};

const addFormFieldError = (fieldName, errorMessage, result) => {
    if (!Array.isArray(result.form.fields[fieldName])) {
        result.form.fields[fieldName] = [];
    }
    if (!result.form.fields[fieldName].includes(errorMessage)) {
        result.form.fields[fieldName].push(errorMessage);
    }
};
