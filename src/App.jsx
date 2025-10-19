import React, { useState, useEffect, useRef } from "react";
import AnalogClock from "./components/AnalogClock";
import CalendarWidget from "./components/CalendarWidget";
import DigitalClock from "./components/DigitalClock";
import TodoList from "./components/TodoList";
import BookmarkCards from "./components/BookmarkCards";
import VanillaTilt from "vanilla-tilt";
import { ConfigProvider, message, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const BG_IMAGES = Array.from({ length: 12 }, (_, i) => `/pic${i + 1}.jpg`);

function App() {
  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem("bgIndex");
    return saved ? Number(saved) : 0;
  });

  // عکس‌های سفارشی کاربر
  const [customImages, setCustomImages] = useState(() => {
    const saved = localStorage.getItem("customImages");
    return saved ? JSON.parse(saved) : [];
  });

  // عکس‌های پیش‌فرض
  const [defaultImages, setDefaultImages] = useState(() => {
    const saved = localStorage.getItem("defaultImages");
    return saved ? JSON.parse(saved) : BG_IMAGES;
  });

  // پیام آنت‌دی
  const [messageApi, contextHolder] = message.useMessage();

  // ذخیره عکس‌های سفارشی و پیش‌فرض در localStorage
  useEffect(() => {
    try {
      localStorage.setItem("customImages", JSON.stringify(customImages));
      localStorage.setItem("defaultImages", JSON.stringify(defaultImages));
    } catch (err) {
      console.error("ERROR ==> ", err);
      messageApi.open({
        type: "error",
        content:
          "حجم عکس‌های انتخابی زیاد است یا فضای مرورگر پر شده است. لطفاً عکس کوچک‌تر انتخاب کنید",
      });
    }
  }, [customImages, defaultImages, messageApi]);

  // هندل انتخاب عکس جدید
  const handleAddImage = (e) => {
    if ([...defaultImages, ...customImages].length >= 15) {
      messageApi.open({
        type: "warning",
        content:
          "حداکثر ۱۵ عکس می‌توانید داشته باشید. برای افزودن عکس جدید، ابتدا یکی از عکس‌ها را حذف کنید",
      });
      e.target.value = "";
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        setCustomImages((prev) => [...prev, ev.target.result]);
        setBgIndex(defaultImages.length + customImages.length);
      } catch (err) {
        console.error("ERROR ==> ", err);
        messageApi.open({
          type: "error",
          content:
            "افزودن این عکس ممکن نیست. حجم عکس زیاد است یا فضای مرورگر کافی نیست",
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // حذف عکس سفارشی یا پیش‌فرض
  const handleDeleteImage = (idx) => {
    if (idx < defaultImages.length) {
      // حذف عکس پیش‌فرض
      const newDefaults = [...defaultImages];
      newDefaults.splice(idx, 1);
      setDefaultImages(newDefaults);
      // اگر عکس حذف شده انتخاب شده بود، عکس اول را انتخاب کن
      if (bgIndex === idx) {
        // اگر عکس دیگری باقی مانده بود، یکی را انتخاب کن
        if (newDefaults.length + customImages.length > 0) {
          setBgIndex(0);
        } else {
          setBgIndex(-1); // هیچ عکس باقی نمانده
        }
      } else if (bgIndex > idx) {
        setBgIndex(bgIndex - 1); // ایندکس را اصلاح کن
      }
    } else {
      // حذف عکس سفارشی
      const customIdx = idx - defaultImages.length;
      const newCustoms = [...customImages];
      newCustoms.splice(customIdx, 1);
      setCustomImages(newCustoms);
      if (bgIndex === idx) {
        if (defaultImages.length + newCustoms.length > 0) {
          setBgIndex(0);
        } else {
          setBgIndex(-1);
        }
      } else if (bgIndex > idx) {
        setBgIndex(bgIndex - 1);
      }
    }
  };

  // لیست همه عکس‌ها (پیش‌فرض + سفارشی)
  const allImages = [...defaultImages, ...customImages];

  // کنترل ارتفاع صفحه
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // اگر ارتفاع کمتر از 700px بود، کارت خوشامد حذف و ساعت‌ها بالا قرار بگیرند
  const isShort = windowHeight < 700;

  return (
    <div
      className="bg w-full grid-container"
      style={{
        backgroundImage: `url(${allImages[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s",
        display: "grid",
        position: "relative",
        gridTemplateColumns:
          windowHeight < 700 || window.innerWidth < 768
            ? "280px 1fr 280px"
            : window.innerWidth < 1024
            ? "200px 1fr 250px"
            : "auto 1fr auto",
        gridTemplateRows: windowHeight < 700 ? "1fr auto" : "auto 1fr auto",
        gap: windowHeight < 700 ? "5px" : "10px",
        padding: "10px",
        height: windowHeight < 530 ? "auto" : "100vh", // اگر کمتر از 530px: اسکرول کل صفحه
        minHeight: windowHeight < 530 ? "100vh" : "auto",
        width: "100%", // عرض کامل
        overflowY: windowHeight < 530 ? "auto" : "hidden", // فقط وقت نیاز اسکرولبار نمایش بده
        overflowX: "hidden", // هیچ‌وقت اسکرول افقی نداشته باش
        gridTemplateAreas:
          windowHeight < 700 || window.innerWidth < 768
            ? `
            "left center right"
            "left bottom-center bottom-center"
          `
            : `
            "left-top center right"
            "left-bottom center right"
            "left-bottom bottom-center right"
          `,
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {},
        }}
      >
        {contextHolder}

        {/* Grid Area 1: بخش چپ - ساعت و کارت خوش‌آمدید */}
        {!isShort && (
          <div className="z-20" style={{ gridArea: "left-top" }}>
            <div className="flex flex-row items-start gap-4">
              <div
                ref={welcomeRef}
                className="glass-black rounded-xl px-4 py-6 text-white text-lg font-semibold shadow-lg flex flex-col items-center justify-center"
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
                به
                <span className="text-4xl text-purple-400 font-extrabold my-5 block">
                  کیفور
                </span>
                خوش آمدید😍
              </div>
              <div className="flex flex-col items-center gap-4">
                <AnalogClock />
                <DigitalClock />
              </div>
            </div>
          </div>
        )}

        {/* Grid Area 2: بخش وسط - کارت‌های بوکمارک */}
        <div
          className="z-10"
          style={{ gridArea: "center", alignSelf: "start" }}
        >
          <BookmarkCards />
        </div>

        {/* Grid Area 3: بخش راست - TodoList */}
        <div
          className="z-10 h-full"
          style={{
            gridArea: "right",
            direction: "rtl",
            minHeight: "400px", // حداقل ارتفاع
            maxHeight: windowHeight < 530 ? "510px" : "none", // در اسکرول: حداکثر 510px
            alignSelf: "start", // همیشه از بالا شروع کن
          }}
        >
          <TodoList />
        </div>

        {/* تقویم و ساعت - سمت چپ */}
        <div
          className="z-20"
          style={{
            gridArea: isShort ? "left" : "left-bottom",
            alignSelf: isShort ? "start" : "end",
            justifySelf: isShort ? "start" : "center",
          }}
        >
          <div
            style={{
              transform: isShort ? "scale(0.75)" : "scale(1)",
              transformOrigin: isShort ? "top left" : "bottom left", // همیشه از چپ scale بشه
            }}
          >
            {/* ساعت‌ها بالای تقویم - فقط در حالت کوتاه */}
            {isShort && (
              <div
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ transform: "scale(1.1)" }}>
                  <AnalogClock />
                </div>
                <div style={{ transform: "scale(1.1)" }}>
                  <DigitalClock />
                </div>
              </div>
            )}
            <CalendarWidget />
          </div>
        </div>

        {/* سوییچر پس‌زمینه - مستقل از grid */}
        <div
          className="z-30"
          style={{
            position: "absolute",
            left: "50vw",
            transform: "translateX(-50%)",
            bottom: "10px",
          }}
        >
          <div className="flex gap-2 bg-black/30 rounded-xl p-2 backdrop-blur-md">
            {allImages.map((img, idx) => (
              <div key={img} className="relative group">
                <button
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
                <button
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black/70 text-xs text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  style={{ zIndex: 10 }}
                  onClick={() => handleDeleteImage(idx)}
                  title="حذف عکس"
                  tabIndex={-1}
                >
                  ×
                </button>
              </div>
            ))}
            <label
              className={`w-5 h-5 flex items-center justify-center rounded-lg border border-dashed border-purple-400 cursor-pointer bg-black/40 hover:bg-purple-400/30 transition ${
                allImages.length >= 15 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <span className="text-purple-400 text-xl font-bold mt-1">
                <PlusOutlined style={{ width: "15px", height: "15px" }} />
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAddImage}
                disabled={allImages.length >= 15}
              />
            </label>
            <button
              className="w-9 h-5 flex items-center justify-center rounded-lg border cursor-pointer border-amber-400 bg-black/40 hover:bg-amber-400/30 transition ml-2"
              title="بازگردانی تصاویر به حالت اولیه"
              onClick={() => {
                setCustomImages([]);
                setDefaultImages(BG_IMAGES);
                setBgIndex(0);
                messageApi.open({
                  type: "success",
                  content: "تصاویر پس‌زمینه به حالت اولیه بازگردانی شد",
                });
                localStorage.removeItem("customImages");
                localStorage.removeItem("defaultImages");
                localStorage.setItem("bgIndex", "0");
              }}
            >
              <span className="text-amber-400 text-[10px]">Reset</span>
            </button>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default App;
