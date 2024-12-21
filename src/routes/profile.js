const express = require("express");
const profileRouter = express.Router();

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  // Here we are reciving the token from login API
  // To read the cookie token we need external package cookie parser
  // Import it and give middleware app.use(cookieParser())
  try {
    // this user we are getting from auth middleware req
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("profile loading failed" + error);
  }
});

// with the help of find method from mongoose we will find user with email
profileRouter.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    res.send(user);
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

// FEED API
profileRouter.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

module.exports = profileRouter;
