const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// api structure is
// :status either be intrested or ignore which we are making dynamic
// :toUserId here will be the id to whom we are sending connection
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // we are getting a logged in user from req.user from userAuth mioddleware
      const fromUserId = req.user._id;
      // with the help of params we are dyanamically taking the status
      const toUserId = req.params.toUserId;
      // with the help of params we are dyanamically taking the userID
      const status = req.params.status;

      // validating the status to be either intrested or ignore
      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type " + status,
        });
      }

      // adding validation on dublicate connection and
      // sending connection to each other
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          // checking if the connection already exist
          { fromUserId, toUserId },
          // checking if the connection if sending each other
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnection) {
        return res.status(400).send({ message: "dublicate connection" });
      }

      // Checking if the User present in a database or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(401).send({
          message: "user does not exist ",
        });
      }

      // We are also checking if the fromUser not sending a connection to toUser
      // In short sending connection request to own
      // This can be checked here in API level but for a good practice we are checking at Schema level

      // Creating a instance of a connectionrequest model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // saving the instance
      const data = await connectionRequest.save();

      // sending back the res in form of json
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR" + error.message);
    }
  }
);

// api structure is
// :status either be accepted or rejected which will be dynamic
// :requestId here will be the received id from sender
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    // logic for a API
    // logged in user be same as toUser then only he/she can accept the request
    // status should be intrested then only he can accept request
    // request id should be valid present in our data base
    // validate the status it can be only accepted rejected

    try {
      // getting loggedinuser from userAuth middleware
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      // validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("status type invalid");
      }

      // validate if the user is present in out database

      const connectionRequestReceived = await ConnectionRequest.findOne({
        // here we are comparing the requestId received in API should be present in our database
        _id: requestId,

        // the loggedIn user should be equal to toUserId then only he can accept the request send to him
        toUserId: loggedInUser._id,

        // only if the status is interested then only we can accept or reject
        status: "interested",
      });
      if (!connectionRequestReceived) {
        return res.status(404).send("invalid connection request not found");
      }

      connectionRequestReceived.status = status;

      const data = await connectionRequestReceived.save();

      res.json({ message: "connection request " + status, data });
    } catch (error) {
      console.error(error.message);

      res.status(400).send(" invalid connection");
    }
  }
);

module.exports = requestRouter;
