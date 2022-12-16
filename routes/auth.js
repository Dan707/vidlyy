const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
router.use(express.json());
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate({
    email: req.email,
    password: req.password,
  });
};

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    res.send(token);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
