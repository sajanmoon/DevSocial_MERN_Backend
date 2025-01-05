const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Creating API to get all the connection received

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  // getting the logged in user
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
    ]);

    res.json({ message: "all the pending request", data: connectionRequest });
  } catch (error) {
    res.status(404).send("data fetched failed" + error.message);
  }
});

// getting all the connection request
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionsAccepted = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
      ]);

    const data = connectionsAccepted.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ messaged: "all the connection", data });
  } catch (error) {
    res.status(404).send("pending requset failed" + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // User should see all the card except
    // - his own card
    // - his connection
    // - he already ignored
    // - already sent a connection

    // finding the loggin user id from userAuth middleware
    const loggedInUser = req.user;

    // PAGINATION
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // finding the ID's of connection sent or recived

    // with the help of find mongoose method with the $or we are finding the
    // fromUserId and toUserId matching to our loggedInUserId

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      // with the help of select we are filtering the data to only fromUserId and toUserId
    }).select("fromUserId toUserId");

    // Here we are only reciving the logged in fromUserId and toUserId i.e send request or recived
    // these are the connection loggedInUser should not see in the feed
    // res.send(connectionRequest);

    // as there will be repeated id we will filter all the dublicate id with help of set()
    // and get all and only the unique id
    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // now after reciving the unique id's this id should not display in the feed

    // here we are now checking the user model and with the $nin we will find the
    // data of hideUserFromFeed and this data should not display in feed
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
