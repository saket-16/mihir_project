const mongoose = require('mongoose');

// Define internal training plan Schema
const intTrainingPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  trainingName: {
    type: String,
    required: true
  },
  trainerName: {
    type: String,
    // required: true,
    default: null
  },
  trainingType: {
    type: String
  },
  planType : {
    type: String,
  },
  link: {
    type: String,
    default: null
  }
});

const intTrainingPlan = mongoose.model('IntTrainingPlan', intTrainingPlanSchema);
module.exports = intTrainingPlan