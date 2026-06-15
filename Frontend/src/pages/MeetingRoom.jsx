import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import socket from "../services/socket";
import ChatBox from "../components/ChatBox";
import VideoCall from "../components/VideoCall";
import Whiteboard from "../components/Whiteboard";
import FileShare from "../components/FileShare";

function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    socket.emit("join-room", {
      roomId,
      userName:
        localStorage.getItem("meetflow-user") ||
        "Guest",
    });

    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("room-users");
      socket.off("receive-message");
    };
  }, [roomId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(
      window.location.href
    );

    alert("Meeting Link Copied!");
  };

  const leaveMeeting = async () => {
    try {
      await fetch(
        "http://localhost:5000/api/meeting/end",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            roomId,
          }),
        }
      );
    } catch (error) {
      console.log(
        "Meeting End Error:",
        error
      );
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-5xl font-bold">
            Meeting Room
          </h1>

          <p className="text-slate-400 mt-2">
            Room ID: {roomId}
          </p>

          <p className="text-slate-400">
            Meeting Time: {seconds} sec
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={copyMeetingLink}
            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
          >
            Copy Link
          </button>

          <button
            onClick={leaveMeeting}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold"
          >
            Leave Meeting
          </button>

        </div>

      </div>

      {/* Video + Users */}

      <div className="grid grid-cols-4 gap-6">

        <div className="col-span-3 bg-slate-800 p-5 rounded-2xl shadow-lg">
          <VideoCall
            socket={socket}
            roomId={roomId}
            users={users}
          />
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl shadow-lg">

          <h2 className="text-xl font-bold mb-3">
            Connected Users ({users.length})
          </h2>

          {users.length === 0 ? (
            <p className="text-slate-400">
              No Users
            </p>
          ) : (
            users.map((user, index) => (
              <div
                key={index}
                className="bg-slate-700 p-3 rounded-lg mb-2"
              >
                👤 {user.name}
              </div>
            ))
          )}

        </div>

      </div>

      {/* Chat + Whiteboard */}

      <div className="grid grid-cols-2 gap-6 mt-6">

        <div className="bg-slate-800 p-5 rounded-2xl shadow-lg">
          <ChatBox
            socket={socket}
            roomId={roomId}
            messages={messages}
            setMessages={setMessages}
          />
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl shadow-lg">
          <Whiteboard />
        </div>

      </div>

      {/* File Sharing */}

      <div className="bg-slate-800 p-5 rounded-2xl mt-6 shadow-lg">
        <FileShare />
      </div>

    </div>
  );
}

export default MeetingRoom;