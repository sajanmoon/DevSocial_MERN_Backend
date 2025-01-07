const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    // we will get token from cookies
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Please login");
    }
    //  Here we will verify the token
    try {
      const decodedObj = jwt.verify(token, process.env.SECRET_KEY_JWT);

      //   Now there will be seprate token for indiviusual profile
      // so to get particular user we will extract the _id from decodedObj
      const { _id } = decodedObj;

      //   Now we will find a particular user by findById method
      //  imported User model
      const user = await User.findById(_id);
      if (!user) {
        throw new Error("user not found");
      }
      //   from here we are sending a user which will be recived by API in req
      req.user = user;
      //   in a API call when we are attaching our middleware so
      //  after exectuing middleware the next() be called and
      // further code will be executed
      next();
    } catch (error) {
      // res.status(400).send("userAuth failed" + error);
      return res
        .status(401)
        .json({ error: "Invalid or expired token. Please login again." });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { userAuth };
