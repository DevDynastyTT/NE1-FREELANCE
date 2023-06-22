import { Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';
const userProfileSchema = new Schema({
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

export const userProfile = models.userProfile || model("userProfile", userProfileSchema);