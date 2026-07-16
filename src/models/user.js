const mongoose = require("mongoose");
const validator = require("validator");
const { default: isURL } = require("validator/lib/isURL");
const userSchema = new mongoose.Schema( //or we can write new schema({}) if we import const {schema} = mongoose
  { 
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxlen:10,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxlength: 10,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Enter strong password Should have 1-Uppercase,1-SpecialCharacter,MinimumLength(6)",
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      trim: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "other"],
    },
    photoUrl: {
      type: String,
      validate: {
        validator(value) {
          if (!isURL(value)) {
            throw new Error("Invalid Photo URL: " + value);
          }
        },
      },
      default:
        "https://www.vectorstock.com/royalty-free-vectors/default-profile-vectors",
    },
    skills: {
      type: [
        {
          type: String,
          minlength: 2,
          maxlength: 10,
          trim: true,
        },
      ],
      validate: [
        {
          validator: (arr) => arr.length <= 10,
          message: "message cannot be more than 10",
        },
      ],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
