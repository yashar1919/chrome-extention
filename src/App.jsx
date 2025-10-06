import AnalogClock from "./components/AnalogClock";
import CalendarWidget from "./components/CalendarWidget";
import DigitalClock from "./components/DigitalClock";

function App() {
  return (
    <div className="bg min-h-screen w-full">
      {/* ساعت‌ها: بالا راست */}
      <div className="fixed top-5 right-5 flex flex-col items-end gap-4 z-20">
        <AnalogClock />
        <DigitalClock />
      </div>
      {/* تقویم: پایین چپ */}
      <div className="fixed bottom-5 left-5 z-20">
        <CalendarWidget />
      </div>
    </div>
  );
}

export default App;
