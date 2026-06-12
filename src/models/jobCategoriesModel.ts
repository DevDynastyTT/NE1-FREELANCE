import mongoose from 'mongoose';

const jobCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const jobCategories = mongoose.model('JobCategories', jobCategoriesSchema);
export default jobCategories
