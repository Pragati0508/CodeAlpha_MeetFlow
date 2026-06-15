import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  const userName =
    localStorage.getItem("meetflow-user");

  const userPhoto =
    localStorage.getItem("meetflow-photo");

 const createMeeting = async () => {
  try {
    const newRoomId = Math.random()
      .toString(36)
      .substring(2, 10);

    await fetch(
      "http://localhost:5000/api/meeting/create",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          roomId: newRoomId,
          host:
            localStorage.getItem(
              "meetflow-user"
            ) || "Guest",
        }),
      }
    );

    navigate(`/room/${newRoomId}`);
  } catch (error) {
    console.log(error);
  }
};
  const joinMeeting = () => {
    if (!roomId.trim()) {
      alert("Please Enter Room ID");
      return;
    }

    navigate(`/room/${roomId.trim()}`);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl text-center w-full max-w-[550px]">

        {/* User Info */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={userPhoto}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-violet-500"
          />

          <h2 className="text-white text-xl font-bold mt-3">
            Welcome, {userName}
          </h2>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">
          MeetFlow 🚀
        </h1>

        <p className="text-slate-300 mb-8">
          Real-Time Video Meetings,
          Chat, Whiteboard &
          Collaboration
        </p>

        <button
          onClick={createMeeting}
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition w-full"
        >
          Create Meeting
        </button>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) =>
              setRoomId(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-700 text-white placeholder-slate-400 border border-slate-600 mb-4 outline-none"
          />

          <button
            onClick={joinMeeting}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition w-full"
          >
            Join Meeting
          </button>
        </div>
        <button
  onClick={() =>
    navigate("/history")
  }
  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition w-full mt-4"
>
  📜 Meeting History
</button>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold mt-6 w-full"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;