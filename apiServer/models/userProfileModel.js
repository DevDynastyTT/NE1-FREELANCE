const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
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

module.exports = mongoose.model('userProfile', userProfileSchema);

