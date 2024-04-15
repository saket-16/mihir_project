const User = require('../Models/User');
const Performance = require('../Models/performance');


exports.addPerformance = async (req, res) => {
    try {
        const { file: performanceData } = req.body;
        console.log(performanceData);
    
        for (const eachPerformance of performanceData) {
          await Performance.findOneAndUpdate(
            { email: eachPerformance.email, userType: req.body.moduleType },
            {
              $set: {
                [`score.${eachPerformance.topic}`]: [
                  eachPerformance.evaluatedScore,
                  eachPerformance.totalScore,
                ],
                // Update the score field dynamically based on the topic
              },
            },
            { upsert: false, new: true }
          );
        }
    
        res
          .status(200)
          .json({ message: "Performance data added successfully", performance });
      } catch (error) {
        console.error("Error adding performance data:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};


exports.getPerformance = async(req, res) => {
  try {

    let performances;
    if (req.params.email) {
      performances = await Performance.find({ email: req.params.email });
    } else {

      performances = await Performance.find({ userType: req.params.type });
    }

    let dataToBeSent = [];
    for (const eachPerformance of performances) {
      const { fullName } = await User.findOne({ email: eachPerformance.email });
      dataToBeSent.push({ fullName: fullName, score: eachPerformance.score });
    }


    res.status(200).json(dataToBeSent);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}