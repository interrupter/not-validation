const ValidationResult = require('../src/result');
const expect = require('chai').expect;

const rawResultRef = {
  fields:{
    lean: ['error', 'error2'],
    late: ['true'],
    angel: []
  },
  form: {
    errors: ['false'],
    fields: {
      foam: ['length'],
      lean: ['destroy']
    }
  }
};;

describe('Result', ()=>{
  it('copy is not reacts on sources changes', () => {
    let resultRaw = JSON.parse(JSON.stringify(rawResultRef));
    const validationResult = new ValidationResult(resultRaw);
    expect(validationResult.getDetailedReport()).to.be.deep.equal(resultRaw);
    delete resultRaw.fields;
    expect(validationResult.getDetailedReport()).to.be.not.deep.equal(resultRaw);
  });

  it('destroy', () => {
    let resultRaw = JSON.parse(JSON.stringify(rawResultRef));
    resultRaw.notEnabledFieldsName = [];
    const validationResult = new ValidationResult(resultRaw);
    validationResult.destroy();
    expect(typeof validationResult.getDetailedReport()).to.be.equal('undefined');
  });

  it('isFieldDirty', () => {
    let resultRaw = JSON.parse(JSON.stringify(rawResultRef));
    const validationResult = new ValidationResult(resultRaw);
    expect(validationResult.isFieldDirty('foam')).to.be.true;
    expect(validationResult.isFieldDirty('lean')).to.be.true;
    expect(validationResult.isFieldDirty('late')).to.be.true;
    expect(validationResult.isFieldDirty('dog')).to.be.false;
  });


  it('getReport', () => {
    let resultRaw = JSON.parse(JSON.stringify(rawResultRef));
    const validationResult = new ValidationResult(resultRaw);
    const reportRef = {
      clean: false,
      fields: {
        lean: ['error', 'error2', 'destroy'],
        late: ['true'],
        foam: ['length']
      },
      form: ['false']
    };
    expect(validationResult.getReport()).to.be.deep.equal(reportRef);
  });

  it('clean', () => {
    let resultRaw = JSON.parse(JSON.stringify(rawResultRef));
    const validationResult = new ValidationResult(resultRaw);
    expect(validationResult.clean).to.be.false;
    const validationResult1 = new ValidationResult({fields:{}, form:{errors: [], fields:{}}});
    expect(validationResult1.clean).to.be.true;
  });

  it('getDefaultResult', () => {
    const defaultValidation = ValidationResult.getDefaultResult({
      lenta: true,
      joy: 12,
      trunk: 'stuck'
    });
    expect(defaultValidation).to.be.deep.equal({
      fields: {
        lenta: [],
        joy: [],
        trunk: []
      },
      form: {
        fields: {
          lenta: [],
          joy: [],
          trunk: []
        },
        errors:[],
        exceptions: []
      },
    });
  });
});
