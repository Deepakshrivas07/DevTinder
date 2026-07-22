const validator = require("validator");
const express = require("express");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Keep password Strong");
  }
};
const validateLogInData = (req) => {
  const { emailId } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid E-mail");
  }
};

const validateEditProfileData = (req) => {
  const data = req.body;
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "about","skills"];
  const isAllowed = Object.keys(data).every((key) =>
    allowedEditFields.includes(key)
  );
  return isAllowed;
};

module.exports = {
  validateSignUpData,
  validateLogInData,
  validateEditProfileData,
};
