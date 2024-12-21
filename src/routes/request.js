const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnection", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " : is Sending the connection request");
});

module.exports = requestRouter;
