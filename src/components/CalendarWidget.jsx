import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/purple.css";
import "react-multi-date-picker/styles/colors/red.css";
import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/colors/yellow.css";
import "react-multi-date-picker/styles/colors/teal.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import DateObject from "react-date-object";

function CalendarWidget() {
  return (
    <div className="absolute bottom-8 left-8 z-10">
      <div className="backdrop-blur-lg bg-black/30 border border-white/20 rounded-2xl p-4 h-[420px]">
        <Calendar
          calendar={persian}
          locale={persian_fa}
          className="!bg-transparent !shadow-none purple bg-dark multi-locale-days"
          plugins={[weekends()]}
          mapDays={({ date }) => {
            // ساخت یک آبجکت جدید با مقدار یونیکس (timestamp) و تبدیل به میلادی
            const miladi = new DateObject(date.toDate()).convert(
              "gregorian",
              "en"
            );

            return {
              children: (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "0 10px",
                    fontSize: "11px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      paddingTop: "2px",
                    }}
                  >
                    {date.format("D")}
                  </div>
                  <div
                    style={{
                      textAlign: "start",
                      opacity: 0.5,
                      fontSize: "10px",
                      paddingBottom: "2px",
                      paddingRight: "2px",
                    }}
                  >
                    {miladi.format("D")}
                  </div>
                </div>
              ),
            };
          }}
        />
      </div>
    </div>
  );
}

export default CalendarWidget;
