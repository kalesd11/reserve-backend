const express = require("express");
const crypto = require("crypto")
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
    const data = new Collection(req.body);

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
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body.toString();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      "whsec_R3XvcwGNgtUhBnLPR0jWGfcTSVoonkY5"
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Access transaction ID from the session object
    const transactionId = session.payment_intent;
    console.log("Transaction ID:", transactionId);

    // Access metadata from the session object
    const seatsMetadata = session.metadata.seats;
    const tripMetadata = session.metadata.trip;
    const personalMetadata = session.metadata.personalInfo;

    // Make another API call here, e.g., to update a database or notify another service
    try {
      const response = await fetch(
        "https://reserve-be.onrender.com/tickets/book_ticket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: transactionId,
            fullname: personalMetadata.fullname,
            trip : tripMetadata._id,
            bus : tripMetadata.busInfo[0]._id ,
            mobile_no:personalMetadata.mobile,
            busFare : tripMetadata.busFare,
            payment_status : true,
            seat_no : seatsMetadata
          }),
        }
      );

      const responseData = await response.json();
      console.log("API Call Response:", responseData);

      res.status(200).json(responseData);
      // Handle the response as needed
    } catch (apiError) {
      console.error("API Call Error:", apiError);
      // Handle API call error
      res.status(400).json("An error occurred");
    }
  }
});

module.exports = router;
