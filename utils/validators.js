const { body } = require("express-validator");
const UserModel = require("../dbModels/userModel");
const { Exception } = require("handlebars");
const bcrypt = require('bcryptjs');

exports.signUpValidator = [
  // check email format
  body("email")
    .isEmail()
    .withMessage("Incorrect email")
    .custom(async (value, { req }) => {
      try {
        const existedUser = await UserModel.findOne({ email: value });
        if (existedUser) {
          return Promise.reject("User with this email already exist");
        }
      } catch (e) {
        throw new Exception(e);
      }
    }),

  // check password format
  body(
    "password1",
    "Incorrect type of password\n 6 alphanumeric symbols is required"
  ).isLength({ min: 6, max: 100 })
    .isAlphanumeric()
    .trim(),

  // check passwords match
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password1) {
      throw new Error("Passwords don`t match");
    }
  }),

  // check username format
  body(
    "username",
    "Incorrect type of username\n 3 alphanumeric symbols is required"
  ).isLength({ min: 3, max: 20 })
    .isAlphanumeric()
    .trim(),
];

exports.signInValidator = [
  // check email format & existence in DB
  body("emailin")
    .isEmail()
    .withMessage("Incorrect email")
    .custom(async (value, { req }) => {
      try {
        const existedUser = await UserModel.findOne({ email: value });
        if (!existedUser) {
          return Promise.reject("No user found with this email");
        }
      } catch (e) {
        throw new Exception(e);
      }
    }),

  // check password match
  body(
    "passwordin",
    "Incorrect type of password\n 6 alphanumeric symbols is required"
  ) .isLength({ min: 6, max: 100 })
    .custom(async (value, { req }) => {
      try {
        const existedUser = await UserModel.findOne({ email: req.body.emailin });
        if (existedUser) {
          const isEq = await bcrypt.compare(value, existedUser.password);
          if (!isEq) {
            return Promise.reject("Incorrect password");
          }
        }
      } catch (e) {
        throw new Exception(e);
      }
    }).isAlphanumeric()
    .trim(),
];

exports.courseValidator = [
  // check name format
  body(
    "name",
    "Incorrect type of name\n 3 alphanumeric symbols is required"
  ).isLength({ min: 3, max: 200 })
    .trim(),

  // check email format
  body("email")
  .isEmail()
  .withMessage("Incorrect email"),

  // check author name format
  body(
    "author",
    "Incorrect type of author name\n 3 alphanumeric symbols is required"
  ).isLength({ min: 3, max: 200 })
    .trim(),

  // check price format
  body(
    "price",
    "Incorrect  price"
  ).isNumeric(),
];
