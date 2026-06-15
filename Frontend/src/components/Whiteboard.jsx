import { useRef, useEffect, useState } from "react";
import socket from "../services/socket";
import { useParams } from "react-router-dom";

function Whiteboard() {
  const canvasRef = useRef(null);
  const { roomId } = useParams();

  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let drawing = false;

    const startDraw = (e) => {
      drawing = true;

      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const stopDraw = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;

      const x = e.offsetX;
      const y = e.offsetY;

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;

      ctx.lineTo(x, y);
      ctx.stroke();

      socket.emit("draw", {
        roomId,
        x,
        y,
        color,
        brushSize,
      });
    };

    socket.on("draw", (data) => {
      ctx.lineWidth = data.brushSize || 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = data.color || "black";

      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    canvas.addEventListener(
      "mousedown",
      startDraw
    );

    canvas.addEventListener(
      "mouseup",
      stopDraw
    );

    canvas.addEventListener(
      "mouseleave",
      stopDraw
    );

    canvas.addEventListener(
      "mousemove",
      draw
    );

    return () => {
      canvas.removeEventListener(
        "mousedown",
        startDraw
      );

      canvas.removeEventListener(
        "mouseup",
        stopDraw
      );

      canvas.removeEventListener(
        "mouseleave",
        stopDraw
      );

      canvas.removeEventListener(
        "mousemove",
        draw
      );

      socket.off("draw");
    };
  }, [roomId, color, brushSize]);

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          🎨 Whiteboard
        </h2>

        <button
          onClick={clearBoard}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Clear Board
        </button>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">

        <button
          className="w-8 h-8 rounded-full bg-black border-2 border-white"
          onClick={() => setColor("#000000")}
        />

        <button
          className="w-8 h-8 rounded-full bg-red-500"
          onClick={() => setColor("#ef4444")}
        />

        <button
          className="w-8 h-8 rounded-full bg-blue-500"
          onClick={() => setColor("#3b82f6")}
        />

        <button
          className="w-8 h-8 rounded-full bg-green-500"
          onClick={() => setColor("#22c55e")}
        />

        <button
          className="w-8 h-8 rounded-full bg-yellow-400"
          onClick={() => setColor("#facc15")}
        />

        <button
          className="w-8 h-8 rounded-full bg-purple-500"
          onClick={() => setColor("#a855f7")}
        />

        <div className="ml-4 flex items-center gap-2">
          <span>Brush</span>

          <input
            type="range"
            min="1"
            max="15"
            value={brushSize}
            onChange={(e) =>
              setBrushSize(
                Number(e.target.value)
              )
            }
          />

          <span>{brushSize}px</span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={700}
        height={350}
        style={{
          border: "2px solid #475569",
          backgroundColor: "white",
          cursor: "crosshair",
          width: "100%",
          borderRadius: "12px",
        }}
      />
    </div>
  );
}

export default Whiteboard;