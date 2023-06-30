import mongoose from 'mongoose';
import { JobCategory } from '../types';

const jobCategoriesSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    }
  })

const jobCategories  = mongoose.model('JobCategories', jobCategoriesSchema);
export default jobCategories
