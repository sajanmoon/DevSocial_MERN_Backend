const { default: mongoose } = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    // Sender User ID : the loggend in used id who is going to send a request
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Receiver User ID : to whom logged in used sending the connection request
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //   the status of a connection request either be intrested or ignore
    status: {
      type: String,
      required: true,
      emun: {
        values: ["ignore", "interested", "rejected", "accepted"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // checking if the fromUser is equal to toUser
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(" cannot send connection to yourself");
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = connectionRequestModel;
