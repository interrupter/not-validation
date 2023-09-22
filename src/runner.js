const {
    composeFieldsValidators,
    composeFormValidators,
} = require("./runner.utils.js");

const ValidationSession = require("./session.js");

/**
 * Creates validation runner function from provided validation rules lib
 * @param {object}     validationLib object containing fields validation rules and form specific rules
 * @returns {function} (data: object, formName: string)=>Promise<ValidationResult>
 **/
const ValidationRunner = (validatorsLib) => {
    /**
     * Validation session runner
     * @param {object} data      object to validate
     * @param {string} formName
     * @returns {Promise}
     **/
    return (data, formName) => {
        const validators = {
            //fields specific validators
            fields: composeFieldsValidators(data, validatorsLib),
            //form specific validators
            form: composeFormValidators(formName, validatorsLib),
        };
        return ValidationSession(validators, data);
    };
};

module.exports = ValidationRunner;
