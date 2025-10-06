import React, { useEffect, useState } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Helper for leading zero
  const pad = (n) => n.toString().padStart(2, "0");

  return (
    <div
      className="glass-black flex items-center justify-center rounded-2xl mt-2"
      style={{
        width: 220,
        height: 50,
        //position: "relative",
      }}
    >
      <div className="">
        {/* ساعت */}
        <span style={{ fontSize: 30, fontWeight: 200, color: "#fff" }}>
          {pad(hours)}
        </span>
        <span
          className="mx-2"
          style={{ fontSize: 40, color: "#fff", opacity: 0.7 }}
        >
          :
        </span>
        {/* دقیقه */}
        <span style={{ fontSize: 30, fontWeight: 200, color: "#fff" }}>
          {pad(minutes)}
        </span>
        <span
          className="mx-2"
          style={{ fontSize: 40, color: "#fff", opacity: 0.7 }}
        >
          :
        </span>
        {/* ثانیه */}
        <span
          style={{
            fontSize: 30,
            fontWeight: 200,
            background: "linear-gradient(90deg,#a78bfa,#f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {pad(seconds)}
        </span>
      </div>
    </div>
  );
}

export default DigitalClock;
