const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, age, email, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("feilds are empty");
  } else if (!validator.isEmail(email)) {
    throw new Error("email not valid");
  }
};
module.exports = { validateSignUpData };
