import React, { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";

function AnalogClock() {
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

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hour = time.getHours();

  // اعداد ساعت
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      ref={clockRef}
      className="glass-black w-[230px] h-[230px] flex items-center justify-center rounded-full  z-20"
    >
      <div className="relative w-[210px] h-[210px] rounded-full">
        {/* اعداد ساعت */}
        {numbers.map((num, i) => {
          const angle = (i + 1) * 30 - 90;
          const radius = 85;
          const x = 105 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 105 + radius * Math.sin((angle * Math.PI) / 180);
          return (
            <span
              key={num}
              className="absolute font-extrabold text-[20px] select-none"
              style={{
                left: x,
                top: y,
                color: "oklch(90.2% 0.063 306.703)",
                fontWeight: 100,
                transform: "translate(-50%, -50%)",
                textShadow: "0 2px 8px #7c3aed88, 0 1px 0 #fff",
                userSelect: "none",
              }}
            >
              {num}
            </span>
          );
        })}
        {/* ساعت */}
        <div
          className="absolute left-1/2 top-1/2 rounded origin-bottom"
          style={{
            width: "6px",
            height: "55px",
            background: "#f3e8ff",
            boxShadow: "0 0 8px 2px #fff4",
            transform: `translate(-50%, -100%) rotate(${
              hour * 30 + min / 2
            }deg)`,
            zIndex: 3,
          }}
        />
        {/* دقیقه */}
        <div
          className="absolute left-1/2 top-1/2 rounded origin-bottom"
          style={{
            width: "4px",
            height: "85px",
            background: "#f3e8ff",
            boxShadow: "0 0 8px 2px #a78bfa88",
            transform: `translate(-50%, -100%) rotate(${min * 6}deg)`,
            zIndex: 2,
          }}
        />
        {/* ثانیه */}
        <div
          className="absolute left-1/2 top-1/2 rounded origin-bottom"
          style={{
            width: "2px",
            height: "92px",
            background: "linear-gradient(180deg, #a78bfa 0%, #f472b6 100%)",
            boxShadow: "0 0 8px 2px #a78bfa88",
            transform: `translate(-50%, -100%) rotate(${sec * 6}deg)`,
            zIndex: 1,
          }}
        />
        {/* مرکز */}
        <div
          className="absolute left-1/2 top-1/2 w-5 h-5 rounded-full border-2 border-white/60"
          style={{
            background: "rgba(168,139,250,0.25)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 8px 2px #a78bfa55",
          }}
        />
      </div>
    </div>
  );
}

export default AnalogClock;
