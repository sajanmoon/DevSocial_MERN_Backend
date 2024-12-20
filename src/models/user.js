const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
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
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female"].includes(value)) {
        throw new Error("gender not valid");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://thenewportbeachdentist.com/wp-content/uploads/2016/10/Michael-Williams.jpg",
  },
  about: {
    type: String,
    default: "this is bio",
  },
  password: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
