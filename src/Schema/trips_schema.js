const mongoose = require("mongoose");

const TripsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  busOwnerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
  },
  seatBooked: {
    type: [String],
    required: true,
  },
  bus_no: {
    type: String,
    default: "",
  },
  amenitiesList: {
    type: [String],
    required: true,
  },
  busFare: {
    type: Number,
    required: true,
  },
  busName: {
    type: String,
    required: true,
  },
});

const trips = mongoose.model("trips", TripsSchema);

module.exports = trips;
