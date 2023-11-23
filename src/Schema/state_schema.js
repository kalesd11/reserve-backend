const { Schema, model } = require("mongoose");

const StateSchema = new Schema({
  state: {
    type: String,
    required: true,
  },
  districts: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const state = model("state_district", StateSchema);
module.exports = state;
