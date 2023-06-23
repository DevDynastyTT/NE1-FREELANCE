const mongoose = require('mongoose');


const jobCategoriesSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    }
  })

module.exports = mongoose.model('JobCategories', jobCategoriesSchema);
