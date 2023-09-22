const emptyFieldsResults = (data) => {
    return Object.keys(data).reduce((acc, curr) => {
        acc[curr] = [];
        return acc;
    }, {});
};

const FIELDS = ["fields", "form"];

module.exports = class ValidationResult {
    #clean = true;
    #result;

    constructor(result) {
        this.#result = JSON.parse(JSON.stringify(result));
        Object.keys(this.#result).forEach((fieldName) => {
            if (!FIELDS.includes(fieldName)) {
                delete this.#result[fieldName];
            }
        });
        this.#clean = this.#result.form.errors.length === 0;
        const list = this.#getFieldsList();
        for (let fieldName of list) {
            if (this.isFieldDirty(fieldName)) {
                this.#clean = false;
            }
        }
    }

    destroy() {
        this.#result = undefined;
    }

    get clean() {
        return this.#clean;
    }

    static getDefaultResult(data) {
        return {
            fields: emptyFieldsResults(data),
            form: {
                fields: emptyFieldsResults(data),
                errors: [],
                exceptions: [],
            },
        };
    }

    getReport() {
        return JSON.parse(JSON.stringify(this.#getCompleteResult()));
    }

    getDetailedReport() {
        if (typeof this.#result === "object") {
            return JSON.parse(JSON.stringify(this.#result));
        } else {
            return undefined;
        }
    }

    isFieldDirty(fieldName) {
        if (
            Array.isArray(this.#result.fields[fieldName]) &&
            this.#result.fields[fieldName].length
        ) {
            return true;
        }
        if (
            Array.isArray(this.#result.form.fields[fieldName]) &&
            this.#result.form.fields[fieldName].length
        ) {
            return true;
        }
        return false;
    }

    getCompleteResultForField(fieldName) {
        const fieldResult = [];
        if (Array.isArray(this.#result.fields[fieldName])) {
            fieldResult.push(...this.#result.fields[fieldName]);
        }
        if (Array.isArray(this.#result.form.fields[fieldName])) {
            fieldResult.push(...this.#result.form.fields[fieldName]);
        }
        return fieldResult;
    }

    #getCompleteResult() {
        const resultComplete = {
            clean: this.#clean,
            fields: {},
            form: [],
        };
        const list = this.#getFieldsList();
        for (let fieldName of list) {
            const errors = this.getCompleteResultForField(fieldName);
            if (errors.length) {
                resultComplete.fields[fieldName] = errors;
            }
        }
        resultComplete.form = [...this.#result.form.errors];
        if (resultComplete.form.length === 0) {
            delete resultComplete.form;
        }
        return resultComplete;
    }

    #getFieldsList() {
        const fields = Object.keys(this.#result.fields);
        const fieldsInForm = Object.keys(this.#result.form.fields);
        return [...new Set([...fieldsInForm, ...fields])];
    }
};
