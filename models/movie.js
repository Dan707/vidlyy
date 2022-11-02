const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const validateMovies = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate({
    title: movie.title,
    genreId: movie.genreId,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate,
  });
};

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});
const Movie = mongoose.model("movie", movieSchema);

exports.Movie = Movie;
exports.validate = validateMovies;
exports.movieSchema = movieSchema;
