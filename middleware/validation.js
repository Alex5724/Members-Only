const { body, matchedData, validationResult } = require("express-validator");
const { insertUser, existingUser } = require("../models/quries");
const bcrypt = require("bcrypt");
const passport = require("passport");

const validateRegisterFields = [
  body("first_name")
    .isString()
    .withMessage("The name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("The name is required")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("The name must be between 2 and 30 characters long")
    .bail()
    .matches(/^[\p{L}' -]+$/u)
    .withMessage("Use only letters, spaces, apostrophe or hyphen"),

  body("last_name")
    .isString()
    .withMessage("The name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("The name is required")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("The name must be between 2 and 30 characters long")
    .bail()
    .matches(/^[\p{L}' -]+$/u)
    .withMessage("Use only letters, spaces, apostrophe or hyphen"),

  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("The email is required.")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email adress."),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("The password is required")
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters")
    .bail()
    .matches(/^(?=.*\p{L})(?=.*\d).+$/u)
    .withMessage("Password must contain at least one letter and one number"),

  body("confirm_password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("The password is required")
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters")
    .bail()
    .matches(/^(?=.*\p{L})(?=.*\d).+$/u)
    .withMessage("Password must contain at least one letter and one number")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords doesn't match"),
];

const validateLoginFields = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("The email is required.")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email adress."),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("The password is required")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Password is too long"),
];

const validateCreateUser = [
  ...validateRegisterFields,

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        errors: errors.array(),
      });
    }

    try {
      const { first_name, last_name, email, password } = matchedData(req);
      const userExists = await existingUser(email);
      const isAdmin = req.body.admin === "on";

      if (userExists) {
        return res.status(409).render("register", {
          errors: [{ msg: "The email is already in use." }],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await insertUser(first_name, last_name, email, hashedPassword, isAdmin);

      return res.redirect("/login");
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).render("register", {
          errors: [{ msg: "The email is already in use." }],
        });
      }

      return next(error);
    }
  },
];

const validateLoginUser = [
  ...validateLoginFields,

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        errors: errors.array(),
      });
    }

    return next();
  },

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

module.exports = {
  validateCreateUser,
  validateLoginUser,
};
