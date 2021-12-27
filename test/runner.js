const {notValidationError} = require('not-error');

const ValidationRunner = require('../src/runner');
const {composeFormValidators,composeFieldsValidators} = require('../src/runner.utils');
const expect = require('chai').expect;

const data = {
  age: 89,
  name: 'long'
};

const validatorsRefWithForms = {
  fields: {
    detail:1,
    age: [{
      validator: async ()=>{
        return false;
      },
      message: '__age_error__'
    }],
    name: [{
      validator: async ()=>{
        return true;
      },
      message: '__name_error__'
    },{
      validator: async ()=>{
        return true;
      },
      message: '__name_error__2'
    }]
  },
  forms: {
    create: [
      async (val)=>{
        return true;
      },
      async (val)=>{
        return true;
      },
    ]
  }
};


const validatorsRefWithForm = {
  fields: {
    age: [{
      validator: async ()=>{
        return false;
      },
      message: '__age_error__'
    }],
    name: [{
      validator: async ()=>{
        return true;
      },
      message: '__name_error__'
    }]
  },
  form: [
    async (val)=>{
      return true;
    }
  ]
};


describe('Runner', ()=>{
  it('with forms', async ()=>{
    const runner = ValidationRunner(validatorsRefWithForms);
    const result = await runner(
      data,
      'create'
    );
    expect(result.clean).to.be.false;
    expect(result.getReport()).to.be.deep.equal({
      clean: false,
      fields: {
        age:['__age_error__']
      }
    });
  });

  describe('composeFieldsValidators', ()=>{
    it('all presented', ()=>{
      const resultValidators = composeFieldsValidators(data, validatorsRefWithForms);
      expect(Object.keys(resultValidators)).to.be.deep.equal(['age', 'name']);
      expect(resultValidators.age.length).to.be.deep.equal(validatorsRefWithForms.fields.age.length);
      expect(resultValidators.name.length).to.be.deep.equal(validatorsRefWithForms.fields.name.length);
    });

    it('all absent', ()=>{
      const resultValidators = composeFieldsValidators({}, validatorsRefWithForms);
      expect(Object.keys(resultValidators).length).to.be.deep.equal(0);
    });

    it('no validators', ()=>{
      const resultValidators = composeFieldsValidators({}, undefined);
      expect(Object.keys(resultValidators).length).to.be.deep.equal(0);
    });

    it('field validators is not array', ()=>{
      const resultValidators = composeFieldsValidators({detail:1}, validatorsRefWithForms);
      expect(Object.keys(resultValidators).length).to.be.deep.equal(0);
    });
  });

  describe('composeFormValidators', ()=>{
    it('no validators', ()=>{
      const resultValidators = composeFormValidators('create', undefined);
      expect(Array.isArray(resultValidators)).to.be.true;
      expect(resultValidators.length).to.be.equal(0);
    });

    it('with forms', ()=>{
      const resultValidators = composeFormValidators('create', validatorsRefWithForms);
      expect(Array.isArray(resultValidators)).to.be.true;
      expect(resultValidators.length).to.be.equal(2);
    });

    it('with form', ()=>{
      const resultValidators = composeFormValidators('create', validatorsRefWithForm);
      expect(Array.isArray(resultValidators)).to.be.true;
      expect(resultValidators.length).to.be.equal(1);
    });

    it('without forms or form', ()=>{
      const resultValidators = composeFormValidators('create', {});
      expect(Array.isArray(resultValidators)).to.be.true;
      expect(resultValidators.length).to.be.equal(0);
    });

  });
});
