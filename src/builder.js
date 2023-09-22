const objHas = (obj, name) => {
    return Object.prototype.hasOwnProperty.call(obj, name);
};
const {
    augmentFieldsValidators,
    augmentFormValidators,
} = require("./builder.utils");

/**
 * @typedef   {object}    notValidationSchema
 * @property  {object}    [fields]
 * @property  {array}     [form]
 * @property  {object}    [forms]
 */

/**
 * returns valid empty validation scheme
 *
 * @return {notValidationSchema}
 */
const emptyScheme = () => {
    return {
        fields: {},
        forms: {},
    };
};
/**
 *
 *
 * @param {object} validators
 * @param {function} getValidatorEnv
 * @return {notValidationSchema}
 */
const validationBuilder = (validators, getValidatorEnv) => {
    if (typeof validators === "undefined" || validators === null) {
        return emptyScheme();
    }
    const augmented = {};
    if (objHas(validators, "fields")) {
        augmented.fields = transformFieldsValidators(
            validators.fields,
            getValidatorEnv
        );
    }
    if (objHas(validators, "forms")) {
        augmented.forms = transformFormsValidators(
            validators.forms,
            getValidatorEnv
        );
    } else {
        if (objHas(validators, "form")) {
            augmented.form = augmentFormValidators(
                validators.form,
                getValidatorEnv
            );
        }
    }
    return augmented;
};

module.exports = validationBuilder;

const transformFieldsValidators = (fields, getValidatorEnv) => {
    const augmented = {};
    for (let fieldName in fields) {
        if (Array.isArray(fields[fieldName])) {
            augmented[fieldName] = augmentFieldsValidators(
                fields[fieldName],
                getValidatorEnv
            );
        }
    }
    return augmented;
};

const transformFormsValidators = (formsValidators, getValidatorEnv) => {
    const augmented = {};
    for (let formName in formsValidators) {
        if (Array.isArray(formsValidators[formName])) {
            augmented[formName] = augmentFormValidators(
                formsValidators[formName],
                getValidatorEnv
            );
        }
    }
    return augmented;
};
