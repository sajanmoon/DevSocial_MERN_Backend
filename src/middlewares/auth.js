const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    // we will get token from cookies
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Please login");
    }
    //  Here we will verify the token
    const decodedObj = await jwt.verify(token, "DEV@123");

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
    res.status(400).send("userAuth failed" + error);
  }
};

module.exports = { userAuth };
