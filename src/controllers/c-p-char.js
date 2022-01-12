const Character = require("../models/Characters");
const ErrorResponse = require("../utils/errorResponse");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const { truncateSync } = require("fs-extra");
const { networkInterfaces } = require("nodemailer/lib/shared");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.privAddChar = async (req, res, next) => {
  const { name, age, weight, charHistory, movies, series } = req.body;
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    if (!result) {
      return next(new ErrorResponse("Upload failed", 503));
    }
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

exports.privGetChars = async (req, res, next) => {
  try {
    const characters = await Character.find();
    if (!characters) {
      return next(new ErrorResponse("Characters not found", 404));
    }
    res.status(200).json({
      success: true,
      data: characters,
    });
  } catch (err) {
    next(err);
  }
};

exports.privGetChar = async (req, res, next) => {
  const id = req.params.id;
  try {
    const character = await Character.findById(id);
    if (!character) {
      return next(new ErrorResponse("Character not found", 404));
    }
    res.status(200).json({
      success: true,
      data: character,
    });
  } catch (err) {
    next(err);
  }
};

exports.privEditChar = async (req, res, next) => {
  console.log("checkpoint1");
  const id = req.params.id;
  const { name, age, weight, charHistory, movies, series } = req.body;
  try {
    const charOG = await Character.findById(id);
    if (!charOG) {
      return next(new ErrorResponse("Character not found", 404));
    }
    await Character.findByIdAndUpdate(id, {
      name: name,
      age: age,
      weight: weight,
      charHistory: charHistory,
      movies: movies,
      series: series,
      imageURL: charOG.imageURL,
      public_id: charOG.public_id,
    });
    const charEdited = await Character.findById(id);
    res.status(200).json({
      success: true,
      data: charEdited,
    });
  } catch (err) {
    next(err);
  }
};

exports.privEditCharPic = async (req, res, next) => {
  const id = req.params.id;
  try {
    const charOG = await Character.findById(id);
    if (!charOG) {
      return next(new ErrorResponse("Character not found", 404));
    }
    const result = await cloudinary.v2.uploader.destroy(charOG.public_id);
    if (!result) {
      return next(new ErrorResponse("Delete failed", 400));
    }
    const newPic = await cloudinary.v2.uploader.upload(req.file.path);
    if (!newPic) {
      return next(new ErrorResponse("Upload failed", 400));
    }
    await Character.findByIdAndUpdate(id, {
      imageURL: newPic.imageURL,
      public_id: newPic.public_id,
    });
    const charNewPic = await Character.findById(id);
    await fs.unlink(req.file.path);
    res.status(200).json({
      success: true,
      data: charNewPic,
    });
  } catch (err) {
    next(err);
  }
};

exports.delChar = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedChar = await Character.findByIdAndDelete(id);
    if (!deletedChar) {
      return next(new ErrorResponse("Character not found", 404));
    }
    const delPic = await cloudinary.v2.uploader.destroy(deletedChar.public_id);
    if (!delPic) {
      return next(new ErrorResponse("Delete failed", 400));
    }
    res.status(200).json({
      success: true,
      message: "Character deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
