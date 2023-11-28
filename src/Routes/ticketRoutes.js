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
    const transactionId = session.payment_intent;
    res.json({ id: session.id, transactionId});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// router.post("/webhook", async (req, res) => {
//   const payload = req.body;
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       payload,
//       sig,
//       "whsec_R3XvcwGNgtUhBnLPR0jWGfcTSVoonkY5"
//     );
//   } catch (err) {
//     console.error("Webhook Error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     // Access transaction ID from the session object
//     const transactionId = session.payment_intent;
//     console.log("Transaction ID:", transactionId);

//     // Make another API call here, e.g., to update a database or notify another service
//     try {
//       const response = await makeAnotherApiCall(transactionId);
//       console.log("API Call Response:", response);

//       res.status(200).json(response);
//       // Handle the response as needed
//     } catch (apiError) {
//       console.error("API Call Error:", apiError);
//       // Handle API call error
//       res.status(400).json("An error occured")
//     }

//   }
// });

// Function to make another API call (replace with your actual API call logic)
// async function makeAnotherApiCall(transactionId) {
//   // Replace the following line with your actual API call logic
//   const response = await fetch("https://your-api-endpoint.com", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Add any other headers as needed
//     },
//     body: JSON.stringify({ transactionId }),
//   });

//   return response.json();
// }

module.exports = router;
