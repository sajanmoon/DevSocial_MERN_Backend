const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const http = require("http");
const initalizeSocket = require("./utils/socket");

require("dotenv").config();
// To receive the JWT token we need the middleware
app.use(cookieParser());

// middleware to convert the request data into JSON data
app.use(express.json());

app.use(
  cors({
    // origin: "https://devtinder-xi.vercel.app",
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", (req, res) => res.send("Works"));

const server = http.createServer(app);

initalizeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected succesfully");
    server.listen(process.env.PORT, () => {
      console.log("server started succesfully");
    });
  })
  .catch(() => {
    console.log("database connection failed");
  });
