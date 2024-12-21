const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

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
    // validate Password is been imported from USER model
    const isPasswordCorrect = await user.validatePassword(password);

    if (isPasswordCorrect) {
      // Creating a JWT token

      // getJWT is been imported from USER model
      const token = await user.getJWT();
      console.log(token);

      res.cookie("token", token, {
        // Here we are expiring the cookies
        expires: new Date(Date.now() + 900000),
      });
      res.send("login succesfull");
    } else {
      res.send("login failed");
    }
  } catch (error) {
    res.status(400).send("login failed" + error);
  }
});

module.exports = authRouter;
