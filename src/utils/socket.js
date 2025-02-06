const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initalizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // const roomId = [userId, targetUserId].sort().join("_");
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + " joined room " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        // save message to the database
        // Here we will have to situation
        // 1st if the chat already exist
        // 2nd creating a chat for the first time

        try {
          // const roomId = [userId, targetUserId].sort().join("_");
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // here if we have already a chat we are finding it
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // if there isnt chat already present
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });

          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (error) {
          console.error(error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initalizeSocket;
