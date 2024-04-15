const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
const Admin = require('../Models/Admin');
const User = require('../Models/User');
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const dotenv = require('dotenv')

dotenv.config();

const mailOptions = {
    from: "",
    subject: "Account creation successful",
  };

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
  


exports.login = async (req, res) => {
    const { email, password: inputPassword } = req.body;

    try {
        // Determine user type
      let foundUser = await Admin.findOne({ email });
      let isAdmin = !!foundUser; // Convert to boolean
      if (!isAdmin) {
        foundUser = await User.findOne({ email });

      }
  
      // Check password (PLAIN TEXT - Not recommended)
      const matched = await bcrypt.compare(inputPassword, foundUser.password);
      if (!matched) {
        return res.status(401).json({ error: "Incorrect password." });
      }
  
      // Generate token
      const token = jwt.sign(
        {
          userId: foundUser._id,
          userType: isAdmin ? "admin" : "user",
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
  
      // Respond with token and user type
      res.json({
        message: "Logged in successfully",
        token,
        userType: isAdmin ? "admin" : foundUser.userType,
        email: email,
        name: foundUser.fullName,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const token = crypto.randomBytes(20).toString("hex");
        await User.findOneAndUpdate(
          { email: email },
          {
            $set: {
              resetPasswordToken: token,
              resetPasswordExpires: Date.now() + 3600000, // Token expires in 1 hour (3600000 milliseconds)
            },
          }
        );
        mailOptions.subject = "Password Reset";
        mailOptions.to = email;
        mailOptions.text = mailOptions.text = `Hey!. 
        Password reset token: ${token} 
        Click the link to reset your password: http://localhost:3001/reset-password 
        Token is valid for 1 hour`;
    
        await transporter.sendMail(mailOptions);
    
        res.status(200).json({ message: "Mail Sent" });
      } catch (err) {
        res.status(400).json({ message: "Failed" });
      }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, token } = req.body;
        let user = await Admin.findOne({ email });
        if (!user) {
          user = await User.findOne({ email });
        }
    
        if (!user) {
          res.status(404).json({ message: "wrong email" });
        }
    
        if (
          user.resetPasswordToken &&
          user.resetPasswordExpires > Date.now() &&
          user.resetPasswordToken === token
        ) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = Date.now();
          user.save();
        } else {
          res.status(404).json({ message: "Illegal process" });
        }
        res.status(200).json({ message: "Password successfully changed" });
      } catch (err) {
        res.status(404).json({ message: "Internal server error" });
      }
};
