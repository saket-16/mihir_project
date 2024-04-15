const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
