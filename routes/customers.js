const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
router.use(express.json());

router.get("/", auth, async (req, res, next) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

router.get("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    res.send(customer);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to post a customer

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  await customer.save();

  res.send(customer);
});

//Endpoint to update a customer

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    res.send(customer);
  } catch (ex) {
    res.send(ex.message);
  }
});

//Endpoint to delete a customer

router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
