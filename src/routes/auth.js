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
    const { firstName, lastName, email, password, photoUrl } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      photoUrl,
      password: hashPassword,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      // Here we are expiring the cookies
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 900000),
    });
    res.json({ message: "user signup succesfull", data: savedUser });
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

      res.cookie("token", token, {
        // Here we are expiring the cookies
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: "none",
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "Login succesfull", user });
    } else {
      throw new Error(" Password is not valid");
    }
  } catch (error) {
    res.status(400).send("login failed" + error);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now()),
  });
  res.send("logout succesful");
});

module.exports = authRouter;
