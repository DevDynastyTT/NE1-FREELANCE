import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  freeLancerID: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    ref: 'jobcategories',
  },
});



const Jobs = mongoose.model('Jobs', jobSchema);
export default Jobs