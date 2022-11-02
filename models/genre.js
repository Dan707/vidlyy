const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

const Genre = mongoose.model("genre", genreSchema);

//Validation of genres

const validateGenres = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate({ name: genre.name });
};

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenres;
