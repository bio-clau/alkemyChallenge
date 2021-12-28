const Character = require("../models/Characters");
const ErrorResponse = require("../utils/errorResponse");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.privAddChar = async (req, res, next) => {
  const { name, age, weight, charHistory, movies, series } = req.body;

  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);

    const newChar = new Character({
      name: name,
      age: age,
      weight: weight,
      charHistory: charHistory,
      movies: movies,
      series: series,
      imageURL: result.url,
      public_id: result.public_id,
    });
    await newChar.save();

    await fs.unlink(req.file.path);

    res.status(200).json({
      success: true,
      message: "Character saved successfully",
    });
  } catch (err) {
    next(err);
  }
};
