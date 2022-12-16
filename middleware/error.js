const winston = require("winston");

module.exports = function (err, req, res, next) {
  //Log the exception
  const logger = winston.createLogger({
    level: "error",
    transports: [
      // new winston.transports.Console(),
      new winston.transports.File({ filename: "error.log" }),
    ],
  });
  logger.error(err.message);
  res.status(500).send("Something Failed ......");
};
