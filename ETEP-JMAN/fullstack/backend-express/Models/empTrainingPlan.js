const mongoose = require("mongoose");

const empTrainingPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  trainingName: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    // required: true,
    default: null,
  },
  trainingType: {
    type: String,
  },
  planType: {
    type: String,
  },
  link: {
    type: String,
    default: null,
  },
});
const empTrainingPlan = mongoose.model(
  "empTrainingPlan",
  empTrainingPlanSchema
);
module.exports = empTrainingPlan;
