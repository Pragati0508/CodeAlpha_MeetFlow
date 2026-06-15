import { useEffect, useRef, useState } from "react";

function VideoCall() {
  const myVideo = useRef(null);
  const remoteVideo = useRef(null);

  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        setStream(mediaStream);

        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }

        console.log("Camera Started");
      } catch (error) {
        console.error(
          "Camera Error:",
          error
        );
      }
    };

    startCamera();
  }, []);

  const toggleMute = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCameraOff(!cameraOff);
  };

  const shareScreen = async () => {
    try {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

      if (myVideo.current) {
        myVideo.current.srcObject =
          screenStream;
      }
    } catch (error) {
      console.error(
        "Screen Share Error:",
        error
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-bold">
          🎥 Video Meeting
        </h2>

        <div className="flex gap-2">
          {isMuted && (
            <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm">
              🔇 Muted
            </span>
          )}

          {cameraOff && (
            <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
              📷 Camera Off
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <button
          onClick={toggleMute}
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl font-semibold transition"
        >
          {isMuted ? "🎤 Unmute" : "🔇 Mute"}
        </button>

        <button
          onClick={toggleCamera}
          className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold transition"
        >
          {cameraOff
            ? "📷 Camera On"
            : "📷 Camera Off"}
        </button>

        <button
          onClick={shareScreen}
          className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-semibold transition"
        >
          🖥️ Share Screen
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <h3 className="mb-3 text-lg font-semibold">
            👤 My Camera
          </h3>

          <video
            ref={myVideo}
            autoPlay
            muted
            playsInline
            className="rounded-xl w-full border border-slate-600"
            style={{
              height: "320px",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <h3 className="mb-3 text-lg font-semibold">
            👥 Remote Participant
          </h3>

          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="rounded-xl w-full border border-slate-600"
            style={{
              height: "320px",
              objectFit: "cover",
              background: "#111827",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default VideoCall;