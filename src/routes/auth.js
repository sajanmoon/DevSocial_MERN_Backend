const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    // new instance of User model
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("user saved succesfully");
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("email is not valid");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user not registered");
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      // Creating a JWT token
      const token = await jwt.sign({ _id: user._id }, "DEV@123");
      console.log(token);

      res.cookie("token", token);
      res.send("login succesfull");
    } else {
      res.send("login failed");
    }
  } catch (error) {
    res.status(400).send("login failed" + error);
  }
});

authRouter.get("/profile", async (req, res) => {
  // Here we are reciving the token from login API
  // To read the cookie token we need external package cookie parser
  // Import it and give middleware app.use(cookieParser())
  const cookies = req.cookies;

  const { token } = cookies;

  const decodedMessage = await jwt.verify(token, "DEV@123");

  const { _id } = decodedMessage;
  console.log("loggeed in user is" + _id);

  const user = await User.findById(_id);
  res.send(user);
});

// with the help of find method from mongoose we will find user with email
authRouter.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    res.send(user);
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

// FEED API
authRouter.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

module.exports = authRouter;
