const express = require("express");

const router = express.Router();

const {
  register,
  login,
  forgotpass,
  resetpass,
} = require("../controllers/c-auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpass").post(forgotpass);

router.route("/resetpass/:resetToken").put(resetpass);

module.exports = router;
