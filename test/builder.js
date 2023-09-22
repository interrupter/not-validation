const expect = require("chai").expect;

const ValidationBuilder = require("../src/builder");

const TestSets = require("./sets");
const getEnvs = () => {
    return "env";
};

describe("Builder", () => {
    it("empty validators", () => {
        const rawValidators = {};
        const rebuildedValidators = ValidationBuilder(rawValidators, getEnvs);
        expect(rebuildedValidators).to.be.deep.equal({});
    });

    it("undefined validators", () => {
        let rawValidators;
        const rebuildedValidators = ValidationBuilder(rawValidators, getEnvs);
        expect(rebuildedValidators).to.be.deep.equal({
            fields: {},
            forms: {},
        });
    });

    it("forms and fields validators", () => {
        let rawValidators = TestSets.validatorsRefWithForms;
        const rebuildedValidators = ValidationBuilder(rawValidators, getEnvs);
        expect(Object.keys(rebuildedValidators)).to.be.deep.equal([
            "fields",
            "forms",
        ]);
    });

    it("form and fields validators", () => {
        let rawValidators = TestSets.validatorsRefWithForm;
        const rebuildedValidators = ValidationBuilder(rawValidators, getEnvs);
        expect(Object.keys(rebuildedValidators)).to.be.deep.equal([
            "fields",
            "form",
        ]);
    });
});
