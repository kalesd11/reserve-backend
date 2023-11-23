const express = require("express");
const State = require("../Schema/state_schema");
const Trip = require("../Schema/trips_schema");
const Bus = require("../Schema/bus_schema");
const Collection = require("../Schema/ticket_schema");
const router = express.Router();

// Add State or DIstrict API
router.post("/addCity", async (req, res) => {
  const data = new State({ ...req.body });
  const result = await data.save();
  res.json(result);
});

// GET API To get all state objects
router.get("/getDistricts", async (req, res) => {
  const data = await State.find();
  res.send(data);
});

// SUggetsted districts API
router.get("/suggestions", async (req, res) => {
  try {
    const { query } = req.query;

    // Use a case-insensitive regex for a partial match
    // const regex = new RegExp(`^${query}`, 'i');
    const regex = new RegExp(query, 'ig');

    // Find matching districts in the states collection
    const suggestions = await State.aggregate([
      {
        $unwind: "$districts",
      },
      {
        $match: {
          "districts.name": { $regex: regex },
        },
      },
      {
        $sort: { "districts.name": -1 },
      },
      {
        $limit : 50
      }
      // {
      //   $group: {
      //     _id: "$districts.name",
      //   },
      // },
    ]);

    // Extract district names from the aggregation result
    // const districtNames = suggestions.map(result => result._id);

    res.json({ suggestions: suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
