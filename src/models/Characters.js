const mongoose = require("mongoose");

const CharacterSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the characters name"],
  },
  age: {
    type: String,
    required: [true, "Please enter the characters age"],
  },
  weight: {
    type: String,
    required: [true, "Please enter the characters weight"],
  },
  charHistory: {
    type: String,
    required: [true, "Plaese enter the characters history"],
  },
  imageURL: {
    type: String,
  },
  public_id: {
    type: String,
  },
  movies: {
    type: Array,
  },
  series: {
    type: Array,
  },
});

const Character = mongoose.model("Character", CharacterSchema);

module.exports = Character;
