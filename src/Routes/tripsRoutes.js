const express = require("express");
const State = require("../Schema/state_schema");
const Trip = require("../Schema/trips_schema");
const Bus = require("../Schema/bus_schema");
const Collection = require("../Schema/ticket_schema");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// POST API to addTrip ///////////////////////////
router.post("/addTrip", async (req, res) => {
  let from = new mongoose.Types.ObjectId(req.body.from);
  let to = new mongoose.Types.ObjectId(req.body.to);
  // try {
    const busData = await Bus.findOne({ bus_no: req.body.bus_no });
    console.log(req.body);
    const data = new Trip({
      date: req.body.date,
      from: from,
      to: to,
      busOwnerID: busData._id,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      category: req.body.category,
      seatBooked: [],
      bus_no: req.body.bus_no,
      amenitiesList: req.body.amenitiesList,
      busFare: req.body.busFare,
      busName: req.body.busName,
    });
    const result = await data.save();
    res.json(result);
  // } catch (err) {
  //   res.json("An Error Occured");
  // }
});

// GET API for trips/////////////////////////////
router.get("/get_trips", async (req, res) => {
  try {
    let from = new mongoose.Types.ObjectId(req.query.from);
    let to = new mongoose.Types.ObjectId(req.query.to);
    console.log(from);
    if (!from || !to) {
      res.json("Please Enter Valid Details");
    } else {
      // console.log(fromdata);
      const data = await Trip.aggregate([
        { $match: { from: from, to: to } },
        {
          $lookup: {
            from: "bus_owners",
            localField: "busOwnerID",
            foreignField: "_id",
            as: "busInfo",
          },
        },
        {
          $lookup: {
            from: "state_districts",
            let: { localFieldId: "$from" }, // Variable to store the local field value
            pipeline: [
              {
                $unwind: "$districts", // Unwind the districts array
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$districts._id", "$$localFieldId"],
                  },
                },
              },
            ],
            as: "fromDist",
          },
        },
        {
          $lookup: {
            from: "state_districts",
            let: { localFieldId: "$to" }, // Variable to store the local field value
            pipeline: [
              {
                $unwind: "$districts", // Unwind the districts array
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$districts._id", "$$localFieldId"],
                  },
                },
              },
            ],
            as: "toDist",
          },
        },
      ])
        .project({
          "fromDist.__v": 0,
          "toDist.__v": 0,
          busInfo__v: 0,
          from: 0,
          to: 0,
          busOwnerID: 0,
          category: 0,
          bus_no: 0,
          __v: 0,
        })
        .limit(50)
        .exec();
      res.json(data);
    }
  } catch (err) {
    res.json("An Error Occured");
  }
});

// GET API for trips by date
router.get("/getTripsByDate", async (req, res) => {
  try {
    const date = req.query.date;
    console.log(date);
    let from = new mongoose.Types.ObjectId(req.query.from);
    let to = new mongoose.Types.ObjectId(req.query.to);
    if (!from || !to) {
      res.json("Please Enter Valid Details");
    } else {
      const data = await Trip.aggregate([
        { $match: { from:from, to:to, date: date } },
        {
          $lookup: {
            from: "bus_owners",
            localField: "busOwnerID",
            foreignField: "_id",
            as: "busInfo",
          },
        },
        {
          $lookup: {
            from: "state_districts",
            let: { localFieldId: "$from" }, // Variable to store the local field value
            pipeline: [
              {
                $unwind: "$districts", // Unwind the districts array
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$districts._id", "$$localFieldId"],
                  },
                },
              },
            ],
            as: "fromDist",
          },
        },
        {
          $lookup: {
            from: "state_districts",
            let: { localFieldId: "$to" }, // Variable to store the local field value
            pipeline: [
              {
                $unwind: "$districts", // Unwind the districts array
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$districts._id", "$$localFieldId"],
                  },
                },
              },
            ],
            as: "toDist",
          },
        },
      ])
        .project({
          "fromDist.__v": 0,
          "toDist.__v": 0,
          from: 0,
          to: 0,
          __v: 0,
        })
        .limit(50)
        .exec();
      res.json(data);
    }
  } catch (err) {
    res.json("An Error Occured");
  }
});

// GET API for Queries Like Filter
router.get("/getTripsByFilter", async (req, res) => {
  let userQuery = {};
  let query = req.query;
  if (query.date) {
    userQuery.date = query.date;
  }
  if (query.from) {
    userQuery.from = new mongoose.Types.ObjectId(query.from);
  }
  if (query.to) {
    userQuery.to =  new mongoose.Types.ObjectId(query.to);
  }
  if (query.startTime) {
    userQuery.startTime = query.startTime;
  }
  if (query.endTime) {
    userQuery.endTime = query.endTime;
  }
  if (query.category) {
    userQuery.category = query.category;
  }
  // console.log(encodeURIComponent(userQuery.category));
  try {
    
    if (!query.from || !query.to) {
      res.json("Please Enter Valid Details");
    } else {
      const data = await Trip.aggregate([
        { $match: userQuery },
        {
          $lookup: {
            from: "bus_owners",
            localField: "busOwnerID",
            foreignField: "_id",
            as: "busInfo",
          },
        },
        {
          $lookup: {
            from: "state_districts",
            let: { localFieldId: "$from" }, // Variable to store the local field value
            pipeline: [
              {
                $unwind: "$districts", // Unwind the districts array
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$districts._id", "$$localFieldId"],
                  },
                },
              },
            ],
            as: "fromDist",
          },
        },
        {
          $lookup: {
            from: "state_districts",
            let: { localFieldId: "$to" }, // Variable to store the local field value
            pipeline: [
              {
                $unwind: "$districts", // Unwind the districts array
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$districts._id", "$$localFieldId"],
                  },
                },
              },
            ],
            as: "toDist",
          },
        },
      ])
        .project({
          "fromDist.__v": 0,
          "toDist.__v": 0,
          busInfo__v: 0,
          from: 0,
          to: 0,
          busOwnerID: 0,
          busName: 0,
          bus_no: 0,
          __v: 0,
        })
        .limit(50)
        .exec();
      res.json(data);
    }
  } catch (err) {
    res.json("An Error Occured");
  }
});

module.exports = router;
