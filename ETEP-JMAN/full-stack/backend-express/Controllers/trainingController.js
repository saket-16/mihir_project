const intTrainingPlan = require('../Models/intTrainingPlan');
const empTrainingPlan = require('../Models/empTrainingPlan');

exports.getIntSchedules = async (req, res) => {
    try {
        // Fetch schedules from the database
        const schedules = await intTrainingPlan.find();
        res.json(schedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};

exports.getEmpSchedules = async (req, res) => {
    try {
        // Fetch schedules from the database
        const schedules = await empTrainingPlan.find();
        res.json(schedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};

exports.createInternalTrainingPlan = async (req, res) => {
    try {
        const {
          date,
          time,
          trainingName,
          trainer: trainerName,
          link,
          type: planType,
          trainingType,
        } = req.body;
    
        const newPlan = new intTrainingPlan({
          date,
          time,
          trainingName,
          trainerName: planType === "training" ? trainerName : null,
          planType: planType,
          link: planType === "training" ? null : link,
          trainingType: planType === "training" ? trainingType : null,
        });
        await newPlan.save();
    
        res
          .status(201)
          .json({ message: "Internal training plan created successfully" });
      } catch (error) {
        console.error("Error creating internal training plan:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};

exports.createEmployeeTrainingPlan = async (req, res) => {
    try {
        const {
          date,
          time,
          trainingName,
          trainer: trainerName,
          link,
          type: planType,
          trainingType,
        } = req.body;
        if (planType === "training") {
          const newPlan = new empTrainingPlan({
            date,
            time,
            trainingName,
            trainerName,
            planType,
            trainingType,
          });
          await newPlan.save();
        } else {
          const newPlan = new empTrainingPlan({
            date,
            time,
            trainingName,
            planType,
            link,
          });
          await newPlan.save();
        }
    
        res
          .status(201)
          .json({ message: "Employee training plan created successfully" });
      } catch (error) {
        console.error("Error creating employee training plan:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};


exports.deletePlan = async(req,res) => {
  if (req.params.type === "intern") {
    const response = await intTrainingPlan.deleteOne({ _id: req.params.id });
    res.status(200).json(response);
  } else {
    const response = await empTrainingPlan.deleteOne({
      _id: req.params.id,
    });
    res.status(200).json(response);
  }
}