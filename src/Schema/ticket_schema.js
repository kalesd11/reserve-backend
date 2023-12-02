const { Schema, model } = require("mongoose");

const Ticket_schema = new Schema({
  transactionId : String,
  session_id : String,
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
  mobile_no :"String",
  seat_no: {
    type: [String],
    required: true,
  },
});

const collection = model("collection", Ticket_schema);
module.exports = collection;
