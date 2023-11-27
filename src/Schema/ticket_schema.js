const { Schema, model } = require("mongoose");

const Ticket_schema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  bus: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  busFare: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required: true,
  },
  seat_no: {
    type: [],
    required: true,
  },
});

const collection = model("collection", Ticket_schema);
module.exports = collection;
