const express = require("express");
const router = express.Router();
const {
  getPosts,
  redirectToRegisterForm,
  redirectToLoginForm,
} = require("../controllers/userController");

const {
  validateCreateUser,
  validateLoginUser,
} = require("../middleware/validation");

router.get("/", getPosts);
router.get("register", redirectToRegisterForm);
router.get("login", redirectToLoginForm);
router.post("login", validateLoginUser);
router.post("register", validateCreateUser);

module.exports = router;
