import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters!"]
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: [true, 'Email already exists!'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    min: 8,
  },
  is_staff: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: false
  },
  date_joined: {
    type: Date,
    default: Date.now
  }
});

export const User = models.User || model("User", UserSchema);
