import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: "String",
    ref: 'User',
    required: [true, "User Id Reference is required!"],
    unique: [true, "User Id must be unique!"],
  },
  profile_picture: {
    type: String,
  },
  bio: {
    type: String,
  },
  credCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CredCard'
  }
});

const userProfiles = mongoose.model('userProfiles', userProfileSchema);
export default userProfiles