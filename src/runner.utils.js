const composeFieldsValidators = (data, validatorsLib) => {
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

const composeFormValidators = (name, validatorsLib) => {
    if (!validatorsLib) return [];
    if (validatorsLib.forms && Array.isArray(validatorsLib.forms[name])) {
        return validatorsLib.forms[name];
    }
    if (Array.isArray(validatorsLib.form)) {
        return validatorsLib.form;
    }
    return [];
};

module.exports = {
    composeFieldsValidators,
    composeFormValidators,
};
