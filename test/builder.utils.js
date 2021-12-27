const expect = require('chai').expect;

const {
  augmentFieldsValidators,
  augmentFieldValidator,
  augmentFormValidators,
  augmentFormValidator
} = require('../src/builder.utils');


describe('BuilderUtils', ()=>{
  it('augmentFormValidator', ()=>{
    const rule = (val, envs)=>{
      expect(val).to.be.deep.equal('data');
      expect(envs).to.be.deep.equal({env: 1});
      return 1;
    };
    const getEnvs = ()=>{
      return {env: 1};
    };
    const result = augmentFormValidator(rule, getEnvs);
    expect(typeof result).to.be.deep.equal('function');
    expect(result('data', {env: 1})).to.be.equal(1);
  });

  it('augmentFormValidators', ()=>{
    const rules = [
      (val, envs)=>{
        expect(val).to.be.deep.equal('data');
        expect(envs).to.be.deep.equal({env: 1});
        return 1;
      },
      (val, envs)=>{
        expect(val).to.be.deep.equal('data');
        expect(envs).to.be.deep.equal({env: 1});
        return 2;
      },
    ];
    const getEnvs = ()=>{
      return {env: 1};
    };
    const results = augmentFormValidators(rules, getEnvs);
    expect(Array.isArray(results)).to.be.true;
    expect(results[0]('data', {env: 1})).to.be.equal(1);
    expect(results[1]('data', {env: 1})).to.be.equal(2);
  });

  describe('augmentFieldValidator', ()=>{
    it('no validation function', ()=>{
      const rule = {
        validator: 'cabbage',
        message: '__message__'
      };
      const result = augmentFieldValidator(rule, ()=>{return {env:1};});
      expect(result.validator).to.be.equal('cabbage');
    });

    it('validation function', async ()=>{
      const rule = {
        async validator(val, envs){
          expect(val).to.be.false;
          expect(envs).to.be.deep.equal({env: 'first'});
          return true;
        },
        message: '__message__'
      };
      const result = augmentFieldValidator(rule, ()=>{return {env: 'first'};});
      expect(typeof result.validator).to.be.equal('function');
      expect(await result.validator(false)).to.be.true;
    });
  });

  it('augmentFieldsValidators', async ()=>{
    const rules = [
      {
        validator: async (val, envs)=>{
          expect(val).to.be.deep.equal('databus');
          expect(envs).to.be.deep.equal({env: 'abc'});
          return 1;
        },
        message: '__first__'
      },{
        validator: async (val, envs)=>{
          expect(val).to.be.deep.equal('databus');
          expect(envs).to.be.deep.equal({env: 'abc'});
          return 2;
        },
        message: '__second__'
      }
    ];
    const getEnvs = ()=>{
      return {env: 'abc'};
    };
    const results = augmentFieldsValidators(rules, getEnvs);
    expect(Array.isArray(results)).to.be.true;
    const params = ['databus', {env: 'abc'}];
    expect(await results[0].validator(...params)).to.be.equal(1);
    expect(await results[1].validator(...params)).to.be.equal(2);
  });
});
