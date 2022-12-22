require("express-async-errors");
const winston = require("winston");
const app = require("express")();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);
require("./startup/routes")(app);
require("./startup/prod");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) =>
    console.log("Couldn't connect to mongodb......", err.message)
  );

process.on("uncaughtException", (ex) => {
  const logger = winston.createLogger({
    level: "error",
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "error.log" }),
    ],
  });
  logger.error(ex.message, ex);
});
process.on("unhandledRejection", (ex) => {
  const logger = winston.createLogger({
    level: "error",
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "error.log" }),
    ],
  });
  logger.error(ex.message, ex);
});

app.listen(port, () => {
  console.log(`Listening at port ${PORT}`);
});
