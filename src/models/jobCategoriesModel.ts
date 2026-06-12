import mongoose from 'mongoose';

const jobCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});

const jobCategories = mongoose.models['JobCategories'] || mongoose.model('JobCategories', jobCategoriesSchema);
export default jobCategories
