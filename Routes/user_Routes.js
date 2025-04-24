require("dotenv").config();
const express = require("express");
const { UserModel } = require("../Model/user_Model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
let Key = process.env.Key;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const otpStore = new Map(); // In-memory store for OTPs, for production use Redis or DB
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const userRegister = express.Router();

userRegister.get("/test", (req, res) => {
  res.send("User route is working");
});

userRegister.post("/signup", async (req, res) => {
  let { email, password, name, mobile, address } = req.body;
  let User = await UserModel.findOne({ email });
  if (User) {
    res.send(`User already register with email:${email}`);
    return;
  }
  let hashPassword = await bcrypt.hash(password, 5);
  try {
    if (hashPassword) {
      let user = await UserModel.create({
        email,
        password: hashPassword,
        name,
        mobile,
        address,
      });
      if (user) {
        res.send("User has been created successfully");
      } else {
        res.send("User is not created");
      }
    } else {
      res.send("Please change the password");
    }
  } catch (err) {
    res.send(err);
  }
});

// Google login route
userRegister.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;
    let user = await UserModel.findOne({ googleId: sub });
    if (!user) {
      user = await UserModel.create({
        googleId: sub,
        email,
        name,
        password: '', // No password for Google users
        address: '',
        mobile: null,
      });
    }
    const jwtToken = jwt.sign({ user: user._id }, process.env.Key);
    res.send({ msg: 'Login successful', token: jwtToken });
  } catch (error) {
    res.status(401).send('Invalid Google token');
  }
});

// Send OTP route
userRegister.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).send('Mobile number is required');
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(mobile, otp);
  try {
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });
    res.send('OTP sent successfully');
  } catch (error) {
    console.error('Twilio send OTP error:', error);
    res.status(500).send('Failed to send OTP: ' + error.message);
  }
});

// Verify OTP route
userRegister.post('/verify-otp', async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).send('Mobile and OTP are required');
  }
  const storedOtp = otpStore.get(mobile);
  if (storedOtp !== otp) {
    return res.status(401).send('Invalid OTP');
  }
  otpStore.delete(mobile);
  let user = await UserModel.findOne({ mobile });
  if (!user) {
    user = await UserModel.create({
      mobile,
      password: '', // No password for OTP users
      email: '',
      name: '',
      address: '',
      isPhoneVerified: true,
      userid: ''
    });
  } else {
    user.isPhoneVerified = true;
    await user.save();
  }
  const jwtToken = jwt.sign({ user: user._id }, process.env.Key);
  res.send({ msg: 'Login successful', token: jwtToken });
});

userRegister.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let User = await UserModel.findOne({ email });
  try {
    if (User) {
      bcrypt.compare(password, User.password, (err, result) => {
        if (err) {
          res.send(err);
        }
        if (result) {
          let token = jwt.sign({ user: User._id }, Key);
          res.send({
            msg: "Login Successfully",
            token,
          });
        } else {
          res.send("Password is wrong");
        }
      });
    } else {
      res.status(401).send("Authentication failed");
    }
  } catch (err) {
    res.send(err);
  }
});

userRegister.get("/getname", async (req, res) => {
  let token = req.headers.token;
  console.log(token);
  try {
    let Userid = await jwt.verify(token, "AccessToken");
    let User = await UserModel.findOne({ _id: Userid.user });
    res.send(User.name);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

module.exports = { userRegister };
