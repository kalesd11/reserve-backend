const express = require("express");
const State = require("../Schema/state_schema");
const Trip = require("../Schema/trips_schema");
const Bus = require("../Schema/bus_schema");
const Collection = require("../Schema/ticket_schema");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51OGcQXSHZSct4ug9KzIRwuF7JaLScMOtX4Q8ciL0LzdZghPCfONI3pwIAbdyYfz8tQgsU9niq6WlHlei5pIt4uW900eY1g8rUW"
);

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
        const seatNos = req.body.seat_no; // Assuming seat_no is an array
        const tripData = await Trip.findByIdAndUpdate(req.body.trip, {
          $push: { seatBooked: { $each: seatNos } },
        });
        res.json(tripData);
      }
    }
  } catch {
    res.json("Something Went Wrong");
  }
});

router.post("/payment", async (req, res) => {
  const { seats, trip } = req.body;
  const lineItems = seats.map((seat) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: "Seat No " + seat,
        // images:[product.imgdata]
      },
      unit_amount: trip.busFare * 100,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  // console.log(session);
  res.json({ id: session.id });
});

module.exports = router;
