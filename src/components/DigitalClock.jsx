import React, { useEffect, useState, useRef, memo, useMemo } from "react";
import VanillaTilt from "vanilla-tilt";

// تنظیمات VanillaTilt را خارج از کامپوننت قرار می‌دهیم
const TILT_CONFIG = {
  max: 18,
  speed: 400,
  glare: true,
  "max-glare": 0.25,
  scale: 1.04,
};

// Helper function برای leading zero - خارج از کامپوننت
const pad = (n) => n.toString().padStart(2, "0");

const DigitalClock = memo(function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const clockRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (clockRef.current) {
      VanillaTilt.init(clockRef.current, TILT_CONFIG);
    }
    return () => {
      if (clockRef.current && clockRef.current.vanillaTilt) {
        //eslint-disable-next-line
        clockRef.current.vanillaTilt.destroy();
      }
    };
  }, []);

  // محاسبه زمان با useMemo
  const formattedTime = useMemo(
    () => ({
      hours: pad(time.getHours()),
      minutes: pad(time.getMinutes()),
      seconds: pad(time.getSeconds()),
    }),
    [time]
  );

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
          {formattedTime.hours}
        </span>
        <span
          className="mx-2"
          style={{ fontSize: 40, color: "#fff", opacity: 0.7 }}
        >
          :
        </span>
        {/* دقیقه */}
        <span style={{ fontSize: 30, fontWeight: 200, color: "#fff" }}>
          {formattedTime.minutes}
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
          {formattedTime.seconds}
        </span>
      </div>
    </div>
  );
});

export default DigitalClock;
