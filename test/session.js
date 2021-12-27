const {notValidationError} = require('not-error');

const ValidationSession = require('../src/session');
const expect = require('chai').expect;


describe('Session', ()=>{
  it('no errors', async()=>{
    const validators = {
      fields:{
        age: [{
          async validator(val){
            return true;
          },
          message: 'age is not right'
        }],
        name: [{
          async validator(val){
            return true;
          },
          message: 'name is not right'
        }]
      },
      form: [
        async (val) => {
          return true;
        }
      ]
    };
    const data = {
      name: 'me',
      age: 89
    };
    const result = await ValidationSession(validators, data);
    expect(result.clean).to.be.true;
  });


  it('fields errors by boolean return', async()=>{
    const validators = {
      fields:{
        age: [{
          async validator(val){
            return false;
          },
          message: 'age is not right'
        }],
        name: [{
          async validator(val){
            return false;
          },
          message: 'name is not right'
        }]
      }
    };
    const data = {
      name: 'me',
      age: 89
    };
    const result = await ValidationSession(validators, data);
    expect(result.clean).to.be.false;
    expect(result.getCompleteResultForField('age')).to.be.deep.equal(['age is not right']);
    expect(result.getCompleteResultForField('name')).to.be.deep.equal(['name is not right']);
  });


  it('fields errors by exception', async()=>{
    const validators = {
      fields:{
        age: [{
          async validator(val){
            throw new Error(1);
          },
          message: 'age is not right'
        }],
        name: [{
          async validator(val){
            throw new Error(1);
          },
          message: 'name is not right'
        }]
      },
      form: [
        async (val) => {
          return true;
        }
      ]
    };
    const data = {
      name: 'me',
      age: 89
    };
    const result = await ValidationSession(validators, data);
    expect(result.clean).to.be.false;
    expect(result.getCompleteResultForField('age')).to.be.deep.equal(['age is not right']);
    expect(result.getCompleteResultForField('name')).to.be.deep.equal(['name is not right']);
  });


  it('form error by exception notValidationError', async()=>{
    const validators = {
      fields:{
        age: [{
          async validator(val){
            return true;
          },
          message: 'age is not right'
        }],
        name: [{
          async validator(val){
            return true;
          },
          message: 'name is not right'
        }]
      },
      form: [
        async (val) => {
          throw new notValidationError('form error', {
            form: ['form error'],

          });
        }
      ]
    };
    const data = {
      name: 'me',
      age: 89
    };
    const result = await ValidationSession(validators, data);
    expect(result.clean).to.be.false;
    const detailed = result.getDetailedReport();
    expect(detailed.form.errors).to.be.deep.equal(['form error']);
  });


  it('form fields errors by exception notValidationError', async()=>{
    const validators = {
      fields:{
        age: [{
          async validator(val){
            return true;
          },
          message: 'age is not right'
        }],
        name: [{
          async validator(val){
            return false;
          },
          message: 'name is not right'
        }]
      },
      form: [
        async (val) => {
          throw new notValidationError('form error', {
            form: ['form error'],
            fields:{
              age: ['form age error'],
              name: ['form name error', 'name is not right']
            },
          });
        }
      ]
    };
    const data = {
      name: 'me',
      age: 89
    };
    const result = await ValidationSession(validators, data);
    expect(result.clean).to.be.false;
    const detailed = result.getDetailedReport();
    expect(detailed.form.errors).to.be.deep.equal(['form error']);
    expect(detailed.form.fields.name).to.be.deep.equal(['form name error', 'name is not right']);
    expect(detailed.form.fields.age).to.be.deep.equal(['form age error']);
  });

  it('form exception', async()=>{
    const validators = {
      fields:{},
      form: [
        async (val) => {
          throw new Error('bad form error');
        }
      ]
    };
    const data = {
      name: 'me',
      age: 89
    };
    try{
      await ValidationSession(validators, data);
      throw new Error('not that error was throwned');
    }catch(e){
      expect(e.message).to.be.equal('bad form error');
    }

  });

});
