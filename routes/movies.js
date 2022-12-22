const express = require("express");
const auth = require("../middleware/auth");
const { Genre } = require("../models/genre");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
router.use(express.json());

//Endpoint to get all movies
router.get("/", auth, async (_, res) => {
  try {
    const movie = await Movie.find().sort("name");
    res.send(movie);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

//Endpoint to get a movie by id
router.get("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to post a movie
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid Genre");
    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to update a movie
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to delete a movie

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
