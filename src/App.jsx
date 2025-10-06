import React, { useState, useEffect, useRef } from "react";
import AnalogClock from "./components/AnalogClock";
import CalendarWidget from "./components/CalendarWidget";
import DigitalClock from "./components/DigitalClock";
import TodoList from "./components/TodoList";
import VanillaTilt from "vanilla-tilt";

const BG_IMAGES = Array.from({ length: 12 }, (_, i) => `/pic${i + 1}.jpg`);

function App() {
  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem("bgIndex");
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("bgIndex", bgIndex);
  }, [bgIndex]);

  // ریف و افکت vanilla-tilt برای کارت خوش آمدید
  const welcomeRef = useRef(null);
  useEffect(() => {
    if (welcomeRef.current) {
      VanillaTilt.init(welcomeRef.current, {
        max: 18,
        speed: 400,
        glare: true,
        "max-glare": 0.25,
        scale: 1.04,
      });
    }
    return () => {
      if (welcomeRef.current && welcomeRef.current.vanillaTilt) {
        //eslint-disable-next-line
        welcomeRef.current.vanillaTilt.destroy();
      }
    };
  }, []);

  return (
    <div
      className="bg min-h-screen w-full"
      style={{
        backgroundImage: `url(${BG_IMAGES[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s",
      }}
    >
      {/* سوییچر پس‌زمینه - وسط پایین صفحه */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 bg-black/30 rounded-xl p-2 backdrop-blur-md">
        {BG_IMAGES.map((img, idx) => (
          <button
            key={img}
            onClick={() => setBgIndex(idx)}
            className={`w-5 h-5 rounded-lg border cursor-pointer ${
              bgIndex === idx
                ? "border-pink-400 ring-1 ring-pink-400"
                : "border-transparent"
            } overflow-hidden transition`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title={`پس‌زمینه ${idx + 1}`}
          />
        ))}
      </div>
      {/* ساعت‌ها و کارت خوش آمدید: بالا راست */}
      <div className="fixed top-5 left-5 flex flex-row items-start gap-4 z-20">
        <div className="flex flex-col items-center gap-4">
          <AnalogClock />
          <DigitalClock />
        </div>
        {/* کارت شیشه‌ای خوش آمدید کنار ساعت */}
        <div
          ref={welcomeRef}
          className="glass-black rounded-xl px-4 py-6 text-white text-lg font-semibold shadow-lg backdrop-blur-md flex flex-col items-center justify-center"
          style={{
            maxWidth: 168,
            width: 168,
            minHeight: 110,
            height: 255,
            textAlign: "center",
            whiteSpace: "normal",
            wordBreak: "break-word",
            direction: "rtl",
          }}
        >
          به اکستنشنِ
          <span className="text-4xl text-purple-400 font-extrabold my-5 block">
            کیفور
          </span>
          خوش آمدید😍
        </div>
      </div>
      {/* تقویم: پایین چپ */}
      <div className="fixed bottom-5 left-5 z-20">
        <CalendarWidget />
      </div>
      {/* کارت شیشه‌ای وسط صفحه */}
      <div
        className="fixed right-0 top-0 bottom-0 z-10 pointer-events-auto p-5"
        style={{ direction: "rtl" }}
      >
        <TodoList />
      </div>
    </div>
  );
}

export default App;
