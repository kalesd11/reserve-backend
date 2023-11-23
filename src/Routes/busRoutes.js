const express = require("express");
const State = require("../Schema/state_schema");
const Trip = require("../Schema/trips_schema");
const Bus = require("../Schema/bus_schema");
const Collection = require("../Schema/ticket_schema");
const router = express.Router();

//POST API to add Bus Info
router.post("/addBus", async (req, res) => {
    try {
      const data = new Bus({
        name: req.body.name,
        category: req.body.category,
        bus_no: req.body.bus_no,
        totalSeats: req.body.totalSeats,
        totalWindowSeatsAvailable: req.body.totalWindowSeatsAvailable,
        rating: req.body.rating,
        amenities: req.body.amenities,
      });
      const result = await data.save();
      res.json(result);
    } catch {
      res.json("AN Error Occured");
    }
  });
  


  module.exports = router;