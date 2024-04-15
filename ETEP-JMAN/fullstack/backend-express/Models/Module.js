const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  topics: {
    type: [String],
    required: true,
  },
  stDate: {
    type: Date,
    required: true,
  },
  enDate: {
    type: Date,
    required: true,
  },
  audience: {
    type: String,
    required: true,
  },
});

// Create and export the model
const Module = mongoose.model("Module", ModuleSchema);
module.exports = Module;
