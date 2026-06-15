const express = require("express");

const router = express.Router();

const {
  createMeeting,
  endMeeting,
  getMeetings,
} = require("../controllers/meetingController");

router.post("/create", createMeeting);

router.post("/end", endMeeting);

router.get("/history", getMeetings);

module.exports = router;