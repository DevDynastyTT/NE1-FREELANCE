const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  // User's username
  username: {
    type: String,
    required: true,
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters!"
    ]
  },
  // User's email
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: [true, 'Email already exists!'],
  },
  // User's password
  password: {
    type: String,
    required: [true, 'Password is required!'],
    min: 8,
  },
  // Whether the user is a staff member
  is_staff: {
    type: Boolean,
    default: false
  },
  // Whether the user account is active
  is_active: {
    type: Boolean,
    default: false
  },
  // Date the user joined
  date_joined: {
    type: Date,
    default: Date.now
  }
});

// Export the User model
module.exports = mongoose.model('Users', UserSchema);
