const User = require("../Models/User");
const Admin = require("../Models/Admin");
const crypto = require("crypto");

const Performance = require("../Models/performance");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_FROM, // Enter your email
      pass: process.env.NODEMAILER_PASSWORD, // Enter your password
    },
  })
);

const mailOptions = {
  from: "",
  subject: "Account creation successful",
};

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = Admin.create({ email, password: hashedPassword, fullName });
    res.status(200).send(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { file: userData, fromEmail } = req.body;
    const refinedUserData = userData.map((eachUserData) => {
      let token = crypto.randomBytes(20).toString("hex");
      let defaultPassword = Math.random().toString(36).slice(-8);

      const { name: fullName, userType, email } = eachUserData;
      return {
        fullName,
        userType,
        email,
        password: defaultPassword,
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      };
    });
    // sending the email
    for (let i = 0; i < refinedUserData.length; i++) {
      const user = await User.findOne({ email: refinedUserData[i].email });

      if (!refinedUserData[i].email || user) continue;
      // create
      await User.create(refinedUserData[i]);
      await Performance.create({
        email: refinedUserData[i].email,
        userType: refinedUserData[i].userType,
      });

      mailOptions.from = fromEmail;
      console.log(refinedUserData[i]);
      mailOptions.to = refinedUserData[i].email;
      mailOptions.text = `Welcome ${refinedUserData[i].fullName}!
          Your ${refinedUserData[i].userType} account has been created.
          Username: ${refinedUserData[i].email}
          Password reset token: ${refinedUserData[i].resetPasswordToken}
          Click the link to reset your password: http://localhost:3001/reset-password
          Token is valid for 1 hour`;
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "User creation successful" });
  } catch (err) {
    res.status(400).json({ message: "User creation failed" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    let cred = await Admin.findById(req.userId);
    let type = "admin";

    if (!cred) {
      cred = await User.findById(req.userId);
      type = cred.userType;
    }

    const infoStatus = {
      type: type,
      name: cred.fullName ? cred.fullName : false,
      email: cred.email ? cred.email : false,
      phoneNumber: cred.phoneNumber ? cred.phoneNumber : false,
      linkedInProfile: cred.linkedInProfile ? cred.linkedInProfile : false,
      skills: cred.skills ? cred.skills : false,
      location: cred.location ? cred.location : false,
      collegeName: cred.collegeName ? cred.collegeName : false,
      program: cred.program ? cred.program : false,
      stream: cred.stream ? cred.stream : false,
    };

    res.status(200).json(infoStatus);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.setUserDetails = async (req, res) => {
  try {
    let newInfo, user;
    user = await Admin.findOne({ email: req.params.email });
    if (user) {
      await Admin.updateOne({ email: req.params.email }, { $set: req.body });
      newInfo = await Admin.findOne({
        email: req.params.email,
      });
    } else {
      await User.updateOne({ email: req.params.email }, { $set: req.body });
      newInfo = await User.findOne({
        email: req.params.email,
      });
    }

    res
      .status(200)
      .json({ data: newInfo, message: "PersonalInfo updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEveryUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
