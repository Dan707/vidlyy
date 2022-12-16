const express = require("express");
const mongoose = require("mongoose");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
router.use(express.json());

router.get("/", auth, async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

//Endpoint to get a specific genre with id

router.get("/:id", auth, async (req, res) => {
  // if (!req.params.id) return res.status(400).send("Invalid Id");
  const genre = await Genre.findById(req.params.id);
  res.send(genre);
});

//Endpoint to post a genre

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  await genre.save();

  res.send(genre);
});

//Endpoint to update a genre

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    res.send(genre);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to delete a genre

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    res.send(genre);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
