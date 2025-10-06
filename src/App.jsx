import React, { useState, useEffect } from "react";
import AnalogClock from "./components/AnalogClock";
import CalendarWidget from "./components/CalendarWidget";
import DigitalClock from "./components/DigitalClock";
import TodoList from "./components/TodoList";

const BG_IMAGES = Array.from({ length: 12 }, (_, i) => `/pic${i + 1}.jpg`);

function App() {
  // خواندن پس‌زمینه انتخابی از localStorage
  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem("bgIndex");
    return saved ? Number(saved) : 0;
  });

  // ذخیره پس‌زمینه انتخابی در localStorage
  useEffect(() => {
    localStorage.setItem("bgIndex", bgIndex);
  }, [bgIndex]);

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
      {/* ساعت‌ها: بالا راست */}
      <div className="fixed top-5 left-5 flex flex-col items-center gap-4 z-20">
        <AnalogClock />
        <DigitalClock />
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
