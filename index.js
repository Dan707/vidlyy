const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const app = express();
const port = process.env.PORT || 5000;
const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");

app.use("/api/customers", customers);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/", home);

mongoose
  .connect("mongodb://0.0.0.0:27017/vidly")
  .then(() => console.log("Connected to mongodb"))
  .catch((err) =>
    console.log("Couldn't connect to mongodb......", err.message)
  );

Fawn.init("mongodb://0.0.0.0:27017/vidly");

//Endpoint to get all genres

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
