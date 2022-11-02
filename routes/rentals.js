const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Customer } = require("../models/customer");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");
router.use(express.json());

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  res.send(rental);
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    res.send(rental);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to post a Rental

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const movie = await Movie.findById(req.body.movieId);
    const customer = await Customer.findById(req.body.customerId);
    if (!movie) return res.status(400).send("Invalid Movie Id");
    if (!customer) return res.status(400).send("Invalid Customer Id");
    if (movie.numberInStock === 0)
      return res.status(400).send("Movie is out of stock");
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    rental = await rental.save();
    movie.numberInStock--;
    movie.save();

    // Fawn.Task()
    //   .save("rentals", rental)
    //   .update(
    //     "movies",
    //     { _id: movie._id },
    //     {
    //       $inc: {
    //         numberInStock: -1,
    //       },
    //     }
    //   )
    //   .run();

    res.send(rental);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to update a Rental

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const movie = await Movie.findById(req.body.movieId);
    const customer = await Customer.findById(req.body.customerId);
    if (!movie) return res.status(400).send("Invalid Movie Id");
    if (!customer) return res.status(400).send("Invalid Customer Id");
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        customer: {
          _id: customer._id,
          name: customer.name,
          isGold: customer.isGold,
          phone: customer.phone,
        },
        movie: {
          _id: movie._id,
          name: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
        dateOut: req.body.dateOut,
        dateReturned: req.body.dateReturned,
        rentalFee: req.body.rentalFee,
      },
      { new: true }
    );
    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID was not found.");

    res.send(rental);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to delete a Rental

router.delete("/:id", async (req, res) => {
  try {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    res.send(rental);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
