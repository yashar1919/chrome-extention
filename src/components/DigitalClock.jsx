import React, { useEffect, useState, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const clockRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (clockRef.current) {
      VanillaTilt.init(clockRef.current, {
        max: 18,
        speed: 400,
        glare: true,
        "max-glare": 0.25,
        scale: 1.04,
      });
    }
    return () => {
      if (clockRef.current && clockRef.current.vanillaTilt) {
        //eslint-disable-next-line
        clockRef.current.vanillaTilt.destroy();
      }
    };
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Helper for leading zero
  const pad = (n) => n.toString().padStart(2, "0");

  return (
    <div
      ref={clockRef}
      className="glass-black flex items-center justify-center rounded-2xl mt-2"
      style={{
        width: 220,
        height: 50,
      }}
    >
      <div>
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
            background: "var(--theme-gradient)",
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
