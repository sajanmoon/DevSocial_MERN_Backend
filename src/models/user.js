const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,

      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 25,
    },
    gender: {
      type: String,
      default: "male",
      emun: {
        value: ["male", "female", "other"],
        message: `{VALUE} is not a gender type`,
      },
      // validate(value) {
      //   if (!["male", "female"].includes(value)) {
      //     throw new Error("gender not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    },
    about: {
      type: String,
      default: "I am a Software Devloper ...",
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

// Here we are setting the token for login user
// This methd we will only write in normal function
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY_JWT, {
    // Here we are expiring a jwt token in 7 days by passing a parameteer
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordCorrect = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordCorrect;
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
