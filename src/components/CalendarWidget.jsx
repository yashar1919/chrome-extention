import { useRef, useEffect } from "react";
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
import VanillaTilt from "vanilla-tilt";

function CalendarWidget({ currentTheme = "purple" }) {
  const calRef = useRef(null);

  // تطبیق تم‌های Calendar با تم‌های اپلیکیشن
  const getCalendarThemeClass = (theme) => {
    const themeMap = {
      purple: "purple",
      red: "red",
      amber: "yellow", // نارنجی طلایی -> زرد
      yellow: "yellow",
      lime: "green", // سبز لیمویی -> سبز
      teal: "teal", // سبز آبی -> teal
      sky: "", // آبی آسمانی -> دیفالت (آبی)
      cyan: "teal", // آبی مایل به سبز -> teal
      indigo: "purple", // نیلی -> بنفش
      rose: "red", // صورتی گلی -> قرمز
    };
    return themeMap[theme] || "";
  };

  useEffect(() => {
    if (calRef.current) {
      VanillaTilt.init(calRef.current, {
        max: 18,
        speed: 400,
        glare: true,
        "max-glare": 0.25,
        scale: 1.04,
      });
    }
    return () => {
      if (calRef.current && calRef.current.vanillaTilt) {
        //eslint-disable-next-line
        calRef.current.vanillaTilt.destroy();
      }
    };
  }, []);

  return (
    <div className="z-10">
      <div ref={calRef} className="glass-black rounded-2xl p-4 h-[420px]">
        {/* backdrop-blur-sm */}
        <Calendar
          calendar={persian}
          locale={persian_fa}
          className={`!bg-transparent !shadow-none ${getCalendarThemeClass(
            currentTheme
          )} bg-dark multi-locale-days`}
          plugins={[weekends()]}
          mapDays={({ date }) => {
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
