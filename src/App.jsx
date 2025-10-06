import CalendarWidget from "./components/CalendarWidget";

function App() {
  return (
    <div className="bg">
      <div className="min-h-screen w-full flex items-center justify-center relative">
        <h1 className="text-white text-3xl font-bold">👋 به کیفور خوش آمدید</h1>
        <CalendarWidget />
      </div>
    </div>
  );
}

export default App;
