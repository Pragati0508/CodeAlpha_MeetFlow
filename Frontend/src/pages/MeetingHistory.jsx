import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MeetingHistory() {
  const [meetings, setMeetings] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "http://localhost:5000/api/meeting/history"
    )
      .then((res) => res.json())
      .then((data) => {
        setMeetings(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          📜 Meeting History
        </h1>

        <button
          onClick={() => navigate("/")}
          className="bg-violet-600 px-5 py-3 rounded-xl"
        >
          Back
        </button>

      </div>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-700">

            <tr>
              <th className="p-4 text-left">
                Room ID
              </th>

              <th className="p-4 text-left">
                Host
              </th>

              <th className="p-4 text-left">
                Duration
              </th>

              <th className="p-4 text-left">
                Created
              </th>
            </tr>

          </thead>

          <tbody>

            {meetings.map((meeting) => (
              <tr
                key={meeting._id}
                className="border-t border-slate-700"
              >
                <td className="p-4">
                  {meeting.roomId}
                </td>

                <td className="p-4">
                  {meeting.host}
                </td>

                <td className="p-4">
                  {meeting.duration || 0} sec
                </td>

                <td className="p-4">
                  {new Date(
                    meeting.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default MeetingHistory;