const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category : {
    type : String,
    required : true
  },
  bus_no : {
    type : String,
    required : true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  totalWindowSeatsAvailable: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    required: true
  }
});

const Bus_schema = mongoose.model('bus_owner', BusSchema);

module.exports = Bus_schema;
