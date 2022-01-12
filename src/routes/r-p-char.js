const express = require("express");
const router = express.Router();
const {
  privAddChar,
  privGetChars,
  privGetChar,
  privEditChar,
  privEditCharPic,
  delChar,
} = require("../controllers/c-p-char");
const { protect } = require("../middlewares/m-auth");

router.route("/add").post(protect, privAddChar);
router.route("/all").get(protect, privGetChars);
router.route("/getChar/:id").get(protect, privGetChar);
router.route("/editChar/:id").put(protect, privEditChar);
router.route("/editCharPic/:id").put(protect, privEditCharPic);
router.route("delete/:id").delete(protect, delChar);

module.exports = router;
