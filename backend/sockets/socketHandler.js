const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join Room
    socket.on("join-room", (data) => {
      const { roomId, userName } = data;

      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      const userExists = rooms[roomId].find(
        (user) => user.id === socket.id
      );

      if (!userExists) {
        rooms[roomId].push({
          id: socket.id,
          name: userName,
        });
      }

      console.log(
        `${userName} joined room ${roomId}`
      );

      io.to(roomId).emit(
        "room-users",
        rooms[roomId]
      );
    });

    // Chat
    // Chat + Images
socket.on("send-message", (data) => {
  const {
    roomId,
    message,
    image,
    type,
  } = data;

  const currentUser =
    rooms[roomId]?.find(
      (user) => user.id === socket.id
    );

  io.to(roomId).emit(
    "receive-message",
    {
      sender:
        currentUser?.name || "Guest",
      message,
      image,
      type,
      time: new Date().toLocaleTimeString(),
    }
  );
});
    // Whiteboard
    socket.on("draw", (data) => {
      socket.to(data.roomId).emit(
        "draw",
        data
      );
    });

    // File Sharing
    socket.on("share-file", (data) => {
      const currentUser =
        rooms[data.roomId]?.find(
          (user) => user.id === socket.id
        );

      io.to(data.roomId).emit(
        "receive-file",
        {
          fileName: data.fileName,
          sender:
            currentUser?.name || "Guest",
        }
      );
    });

    // WebRTC Offer
    socket.on("offer", (data) => {
      socket.to(data.roomId).emit(
        "offer",
        {
          offer: data.offer,
          sender: socket.id,
        }
      );
    });

    // WebRTC Answer
    socket.on("answer", (data) => {
      socket.to(data.roomId).emit(
        "answer",
        {
          answer: data.answer,
          sender: socket.id,
        }
      );
    });

    // ICE Candidate
    socket.on("ice-candidate", (data) => {
      socket.to(data.roomId).emit(
        "ice-candidate",
        {
          candidate: data.candidate,
          sender: socket.id,
        }
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${socket.id}`
      );

      for (let roomId in rooms) {
        rooms[roomId] = rooms[
          roomId
        ].filter(
          (user) =>
            user.id !== socket.id
        );

        io.to(roomId).emit(
          "room-users",
          rooms[roomId]
        );

        if (
          rooms[roomId].length === 0
        ) {
          delete rooms[roomId];
        }
      }
    });
  });
};

module.exports = socketHandler;