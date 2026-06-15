import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

function ChatBox({
  socket,
  roomId,
  messages,
}) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      message,
      type: "text",
    });

    setMessage("");
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(
      (prev) => prev + emojiData.emoji
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      socket.emit("send-message", {
        roomId,
        image: reader.result,
        type: "image",
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">
        💬 Team Chat
      </h2>

      <div
        className="bg-slate-800 rounded-2xl p-4 overflow-y-auto border border-slate-700"
        style={{
          height: "400px",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-slate-400">
            No messages yet
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe =
              msg.sender ===
              localStorage.getItem(
                "meetflow-user"
              );

            return (
              <div
                key={index}
                className={`flex mb-4 ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg ${
                    isMe
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  <div className="text-xs opacity-70 mb-2 font-semibold">
                    👤 {msg.sender}
                  </div>

                  {msg.type ===
                  "image" ? (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="rounded-xl max-h-64 border border-slate-500"
                    />
                  ) : (
                    <div className="break-words text-base">
                      {msg.message}
                    </div>
                  )}

                  <div className="text-[11px] opacity-70 mt-2 text-right">
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={chatEndRef}></div>
      </div>

      {showEmojiPicker && (
        <div className="mt-3 mb-3">
          <EmojiPicker
            onEmojiClick={
              handleEmojiClick
            }
          />
        </div>
      )}

      <div className="flex gap-3 mt-4">

        <button
          onClick={() =>
            setShowEmojiPicker(
              !showEmojiPicker
            )
          }
          className="bg-yellow-500 hover:bg-yellow-600 px-4 rounded-2xl text-xl"
        >
          😀
        </button>

        <button
          onClick={() =>
            fileInputRef.current.click()
          }
          className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded-2xl text-xl"
        >
          📷
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={
            handleImageUpload
          }
        />

        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              sendMessage();
            }
          }}
          className="flex-1 p-4 rounded-2xl bg-slate-800 text-white placeholder-slate-400 border border-slate-600 outline-none focus:border-blue-500"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold transition"
        >
          🚀
        </button>

      </div>
    </div>
  );
}

export default ChatBox;