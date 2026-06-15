const Meeting = require("../models/Meeting");

exports.createMeeting = async (
  req,
  res
) => {
  try {
    const { roomId, host } = req.body;

    const meeting =
      await Meeting.create({
        roomId,
        host,
        participants: [],
        startTime: new Date(),
      });

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.endMeeting = async (
  req,
  res
) => {
  try {
    const { roomId } = req.body;

    const meeting =
      await Meeting.findOne({
        roomId,
      });

    if (!meeting) {
      return res.status(404).json({
        message:
          "Meeting not found",
      });
    }

    meeting.endTime = new Date();

    meeting.duration = Math.floor(
      (meeting.endTime -
        meeting.startTime) /
        1000
    );

    await meeting.save();

    res.json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMeetings = async (
  req,
  res
) => {
  try {
    const meetings =
      await Meeting.find().sort({
        createdAt: -1,
      });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};