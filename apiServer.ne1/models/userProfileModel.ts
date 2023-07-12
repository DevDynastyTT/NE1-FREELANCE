import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: [true, "User Id Reference is required!"],
    unique: [true, "User Id must be unique!"],
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  creditCard: {
    type: String,
    ref: 'creditcard'
  }
});

const userProfiles = mongoose.model('userProfiles', userProfileSchema);
export default userProfiles