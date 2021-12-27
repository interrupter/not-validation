const executeObjectFunction = require('../src/common');

const expect = require('chai').expect;

describe('Common executeObjectFunction', ()=>{
  it('promise', async ()=>{
    const obj = {
      async method(...params){
        return 'apple '+params.join('.');
      }
    }, name = 'method', params = [1,2,3,true];
    const res = await executeObjectFunction(obj.method, params);
    expect(res).to.be.equal('apple 1.2.3.true');
  });

  it('function', async ()=>{
    const obj = {
      method(...params){
        return 'apple '+params.join('.');
      }
    }, name = 'method', params = [1,2,3,true];
    const res = await executeObjectFunction(obj.method, params);
    expect(res).to.be.equal('apple 1.2.3.true');
  });

  it('!function', async ()=>{
    const obj = null, name = 'method', params = [1,2,3,true];
    const res = await executeObjectFunction(null, params);
    expect(res).to.be.undefined;
  });
});
