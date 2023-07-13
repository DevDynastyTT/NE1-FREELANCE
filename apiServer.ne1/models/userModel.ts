import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters!"]
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: [true, 'Email already exists!'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    min: [8, 'Password must be at least 8 characters!'],
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

const Users = mongoose.model('users', UserSchema);

export default Users;
