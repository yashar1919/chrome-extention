import AnalogClock from "./components/AnalogClock";
import CalendarWidget from "./components/CalendarWidget";
import DigitalClock from "./components/DigitalClock";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="bg min-h-screen w-full">
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
