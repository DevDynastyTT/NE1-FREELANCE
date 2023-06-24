const Schema = require('mongoose')
const model = require('mongoose')
const models = require('mongoose')
const mongoose = require('mongoose')

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

module.exports = mongoose.model('userProfiles', userProfileSchema);
// export const userProfile = models.userProfile || model("userProfile", userProfileSchema);