const mongoose = require("mongoose");
const Joi = require("joi");

const validateCustomers = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(5).max(50).required(),
  });
  return schema.validate({
    name: customer.name,
    isGold: customer.isGold,
    phone: customer.phone,
  });
};

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});
const Customer = mongoose.model("customer", customerSchema);

exports.Customer = Customer;
exports.validate = validateCustomers;
exports.customerSchema = customerSchema;
