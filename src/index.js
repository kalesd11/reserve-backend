// Importing packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const trips = require("./Routes/tripsRoutes");
const buses = require("./Routes/busRoutes");
const dists = require("./Routes/stateRoutes");
const tickets = require("./Routes/ticketRoutes");

// Declaring variables
require("dotenv").config();
const app = express();

// Apply middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/trips", trips);
app.use("/buses", buses);
app.use("/dists", dists);
app.use("/tickets", tickets);

const port = process.env.PORT || 5000;
const mongodbURI =
  process.env.MONGO_URI ||
  "mongodb+srv://surajkales111:Suraj%40011@cluster0.attymsz.mongodb.net/redbus";
  console.log(process.env.MONGO_URI);
mongoose.connect(mongodbURI).then(() => {
  console.log("Database is Connected");
});
// Create Server
app.listen(port, () => {
  console.log("Server is started on port " + port);
});
