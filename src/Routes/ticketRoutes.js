const express = require("express");
const State = require("../Schema/state_schema");
const Trip = require("../Schema/trips_schema");
const Bus = require("../Schema/bus_schema");
const Collection = require("../Schema/ticket_schema");
const router = express.Router();

//POST API for Ticket Booking
router.post("/book_ticket", async (req, res) => {
    try {
      const data = new Collection({
        fullname: req.body.fullname,
        trip: req.body.trip,
        bus: req.body.bus,
        busFare: req.body.busFare,
        paymentStatus: req.body.paymentStatus,
        seat_no: req.body.seat_no,
      });
  
      const result = await data.save();
      // check if payment status is successfull
      if (!result.paymentStatus) {
        res.json("Sorry Could not complete the payment");
      } else {
        //check if seat is available
        const seat = await Trip.findById(req.body.trip);
        if (seat.seatBooked.includes(req.body.seat_no)) {
          res.json("Sorry! Seat is already booked!");
        } else {
          const tripData = await Trip.findByIdAndUpdate(req.body.trip, {
            $push: { seatBooked: req.body.seat_no },
          });
          res.json(tripData);
        }
      }
    } catch {
      res.json("Something Went Wrong");
    }
  });
  

module.exports = router