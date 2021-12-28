const express = require("express");
const router = express.Router();
const { privAddChar } = require("../controllers/c-p-char");
const { protect } = require("../middlewares/m-auth");

router.route("/add").post(protect, privAddChar);
