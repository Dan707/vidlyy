const mongoose = require("mongoose");
const Joi = require("joi");
const { customerSchema } = require("./customer");
const { movieSchema } = require("./movie");

const validateRentals = (rental) => {
  const schema = Joi.object({
    // title: Joi.string().min(5).max(50).required(),
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  return schema.validate({
    customerId: rental.customerId,
    movieId: rental.movieId,
  });
};

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});
rentalSchema.post("save", function () {
  console.log(this);
});
const Rental = mongoose.model("rental", rentalSchema);

exports.Rental = Rental;
exports.validate = validateRentals;
