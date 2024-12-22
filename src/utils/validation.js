const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, age, email, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("feilds are empty");
  } else if (!validator.isEmail(email)) {
    throw new Error("email not valid");
  }
};

const validateEditData = (req) => {
  const allowedEditFeilds = [
    "firstName",
    "lastName",
    "age",
    "email",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((feilds) =>
    allowedEditFeilds.includes(feilds)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditData };
