const Admin = require("../Models/Admin");
const User = require("../Models/User");


exports.emailValid = async(req, res) => {
    try {
        const { email } = req.body;
        let user = await Admin.findOne({ email });
        if (!user) {
          user = await User.findOne({ email });
        }
        res.status(200).send({ valid: !!user });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}
