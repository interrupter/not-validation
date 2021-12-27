
module.exports.validatorsRefWithForms = {
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
    ],
    delete: 1
  }
};


module.exports.validatorsRefWithForm = {
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
