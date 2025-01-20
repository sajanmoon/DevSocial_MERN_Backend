const express = require("express");
const profileRouter = express.Router();

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} Profile updated succesfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("edit failed " + error);
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

module.exports = profileRouter;
