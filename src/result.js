const emptyFieldsResults = (data)=>{
  return Object.keys(data).reduce((acc, curr)=>{acc[curr] = []; return acc;}, {});
};

module.exports = class ValidationResult{

  #result;

  constructor(result){
    this.#result = JSON.parse(JSON.stringify(result));
  }

  destroy(){
    this.#result = undefined;
  }

  get clean(){
    return this.#result.clean;
  }

  static getDefaultResult(data){
    return {
      clean: true,
      fields: emptyFieldsResults(data),
      form: {
        fields: emptyFieldsResults(data),
        errors:[],
        exceptions: []
      },
    };
  }

  getReport(){
    return JSON.parse(JSON.stringify(this.#getCompleteResult()));
  }

  getDetailedReport(){
    return JSON.parse(JSON.stringify(this.#result));
  }

  #getCompleteResult(){
    const resultComplete = {
      clean: this.#result.form.errors.length === 0,
      fields: {},
      form: []
    };
    for(let fieldName in this.#result.fields){
      resultComplete.fields[fieldName] = this.#getCompleteResultForField(fieldName);
      if(resultComplete.fields[fieldName].length){
        resultComplete.clean = false;
      }
    }
    resultComplete.form = [...this.#result.form.errors];
    return resultComplete;
  }

  #getCompleteResultForField(fieldName){
    const fieldResult = [];
    if(Array.isArray(this.#result.fields[fieldName])){
      fieldResult.push(...this.#result.fields[fieldName]);
    }
    if(Array.isArray(this.#result.form.fields[fieldName])){
      fieldResult.push(...this.#result.form.fields[fieldName]);
    }
    return fieldResult;
  }

};
