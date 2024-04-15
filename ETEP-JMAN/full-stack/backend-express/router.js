const express = require("express");
const router = express.Router();

const userController = require("./Controllers/userController");
const authController = require("./Controllers/authController");
const moduleController = require("./Controllers/moduleController");
const performanceController = require("./Controllers/performanceController");
const trainingController = require("./Controllers/trainingController");
const validityController = require("./Controllers/validityController");

const authMiddleware = require("./Middlewares/authMiddleware");

// User routes
router.post("/createAdmin", userController.createAdmin);
router.post("/createUser", userController.createUser);
router.post("/login", authController.login);
router.post("/forget-password", authController.forgetPassword);
router.post("/emailValidity", validityController.emailValid);
router.post("/resetPassword", authController.resetPassword);
router.get(
  "/user-details",
  authMiddleware.withAuth,
  userController.getUserDetails
);
router.post(
  "/internal-training-plan",
  trainingController.createInternalTrainingPlan
);
router.post(
  "/employee-training-plan",
  trainingController.createEmployeeTrainingPlan
);
router.get("/intSchedules", trainingController.getIntSchedules);
router.get("/empSchedules", trainingController.getEmpSchedules);
router.post("/performance", performanceController.addPerformance);
router.get(
  "/getPerformance/:type/:email",
  performanceController.getPerformance
);
router.post("/personal-info/:email", userController.setUserDetails);
router.post("/createModule", moduleController.createModule);
router.get("/getModules/:audience", moduleController.getModules);
router.get("/deletePlan/:type/:id", trainingController.deletePlan);
router.get("/getEvr", userController.getEveryUser);

module.exports = router;
