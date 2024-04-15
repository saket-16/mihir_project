const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  linkedInProfile: {
    type: String,
    // required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  location: {
    type: String,

  },
  collegeName: {
    type: String,

  },
  program: {
    type: String,

  },
  stream: {
    type: String,
    // required: true,
  },
  isPasswordSet: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

});

const User = mongoose.model("User", userSchema);
module.exports = User;
