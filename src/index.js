// Importing packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const env = require('dotenv')
const trips = require("./Routes/tripsRoutes");
const buses = require("./Routes/busRoutes")
const dists = require("./Routes/stateRoutes")
const  tickets= require("./Routes/ticketRoutes")

// Declaring variables
const port = process.env.PORT || 5000
const app = express();
const mongodbURI = process.env.MONGO_URI;

// Apply middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/trips",trips)
app.use("/buses",buses)
app.use("/dists",dists)
app.use("/tickets",tickets)

env.config()
mongoose.connect(mongodbURI).then(()=>{
    console.log("Database is Connected")
})
// Create Server
app.listen(port, ()=>{
    console.log("Server is started on port "+ port);
})
