import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import VanillaTilt from "vanilla-tilt";
import { ConfigProvider, message, theme as antTheme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useWindowSize from "./hooks/useWindowSize";

// Lazy loading برای کامپوننت‌های سنگین
const AnalogClock = lazy(() => import("./components/AnalogClock"));
const CalendarWidget = lazy(() => import("./components/CalendarWidget"));
const DigitalClock = lazy(() => import("./components/DigitalClock"));
const TodoList = lazy(() => import("./components/TodoList"));
const BookmarkCards = lazy(() => import("./components/BookmarkCards"));

// Loading component سبک
const ComponentLoader = memo(() => (
  <div className="flex items-center justify-center h-20 w-20 rounded-xl bg-black/30 backdrop-blur-sm">
    <div className="animate-pulse text-white">⏳</div>
  </div>
));

// تصاویر پیش‌فرض را خارج از کامپوننت تعریف می‌کنیم تا در هر render دوباره ساخته نشود
const BG_IMAGES = Array.from({ length: 7 }, (_, i) => `/pic${i + 1}.jpg`);

// تنظیمات VanillaTilt را خارج از کامپوننت قرار می‌دهیم
const WELCOME_TILT_CONFIG = {
  max: 18,
  speed: 400,
  glare: true,
  "max-glare": 0.25,
  scale: 1.04,
};

// تم‌های رنگی با رنگ‌های Tailwind - خارج از کامپوننت
const colorThemes = {
  purple: {
    name: "بنفش",
    primary: "#9333ea",
    primaryLight: "#a855f7",
    secondary: "#c084fc",
    accent: "#e879f9",
    background: "rgba(147, 51, 234, 0.1)",
    border: "rgba(147, 51, 234, 0.2)",
    text: "#c084fc",
    gradient: "linear-gradient(90deg, #a855f7, #e879f9)",
    gradientButton: "linear-gradient(135deg, #9333ea, #e879f9)",
  },
  red: {
    name: "قرمز",
    primary: "#dc2626",
    primaryLight: "#ef4444",
    secondary: "#f87171",
    accent: "#fca5a5",
    background: "rgba(220, 38, 38, 0.1)",
    border: "rgba(220, 38, 38, 0.2)",
    text: "#f87171",
    gradient: "linear-gradient(90deg, #ef4444, #fca5a5)",
    gradientButton: "linear-gradient(135deg, #dc2626, #fca5a5)",
  },
  amber: {
    name: "نارنجی طلایی",
    primary: "#d97706",
    primaryLight: "#f59e0b",
    secondary: "#fbbf24",
    accent: "#fcd34d",
    background: "rgba(217, 119, 6, 0.1)",
    border: "rgba(217, 119, 6, 0.2)",
    text: "#fbbf24",
    gradient: "linear-gradient(90deg, #f59e0b, #fcd34d)",
    gradientButton: "linear-gradient(135deg, #d97706, #fcd34d)",
  },
  yellow: {
    name: "زرد",
    primary: "#ca8a04",
    primaryLight: "#eab308",
    secondary: "#facc15",
    accent: "#fde047",
    background: "rgba(202, 138, 4, 0.1)",
    border: "rgba(202, 138, 4, 0.2)",
    text: "#facc15",
    gradient: "linear-gradient(90deg, #eab308, #fde047)",
    gradientButton: "linear-gradient(135deg, #ca8a04, #fde047)",
  },
  lime: {
    name: "سبز لیمویی",
    primary: "#65a30d",
    primaryLight: "#84cc16",
    secondary: "#a3e635",
    accent: "#bef264",
    background: "rgba(101, 163, 13, 0.1)",
    border: "rgba(101, 163, 13, 0.2)",
    text: "#a3e635",
    gradient: "linear-gradient(90deg, #84cc16, #bef264)",
    gradientButton: "linear-gradient(135deg, #65a30d, #bef264)",
  },
  teal: {
    name: "سبز آبی",
    primary: "#0d9488",
    primaryLight: "#14b8a6",
    secondary: "#2dd4bf",
    accent: "#5eead4",
    background: "rgba(13, 148, 136, 0.1)",
    border: "rgba(13, 148, 136, 0.2)",
    text: "#2dd4bf",
    gradient: "linear-gradient(90deg, #14b8a6, #5eead4)",
    gradientButton: "linear-gradient(135deg, #0d9488, #5eead4)",
  },
  sky: {
    name: "آبی آسمانی",
    primary: "#0284c7",
    primaryLight: "#0ea5e9",
    secondary: "#38bdf8",
    accent: "#7dd3fc",
    background: "rgba(2, 132, 199, 0.1)",
    border: "rgba(2, 132, 199, 0.2)",
    text: "#38bdf8",
    gradient: "linear-gradient(90deg, #0ea5e9, #7dd3fc)",
    gradientButton: "linear-gradient(135deg, #0284c7, #7dd3fc)",
  },
  cyan: {
    name: "آبی مایل به سبز",
    primary: "#0891b2",
    primaryLight: "#06b6d4",
    secondary: "#22d3ee",
    accent: "#67e8f9",
    background: "rgba(8, 145, 178, 0.1)",
    border: "rgba(8, 145, 178, 0.2)",
    text: "#22d3ee",
    gradient: "linear-gradient(90deg, #06b6d4, #67e8f9)",
    gradientButton: "linear-gradient(135deg, #0891b2, #67e8f9)",
  },
  indigo: {
    name: "نیلی",
    primary: "#4338ca",
    primaryLight: "#6366f1",
    secondary: "#818cf8",
    accent: "#a5b4fc",
    background: "rgba(67, 56, 202, 0.1)",
    border: "rgba(67, 56, 202, 0.2)",
    text: "#818cf8",
    gradient: "linear-gradient(90deg, #6366f1, #a5b4fc)",
    gradientButton: "linear-gradient(135deg, #4338ca, #a5b4fc)",
  },
  rose: {
    name: "صورتی گلی",
    primary: "#e11d48",
    primaryLight: "#f43f5e",
    secondary: "#fb7185",
    accent: "#fda4af",
    background: "rgba(225, 29, 72, 0.1)",
    border: "rgba(225, 29, 72, 0.2)",
    text: "#fb7185",
    gradient: "linear-gradient(90deg, #f43f5e, #fda4af)",
    gradientButton: "linear-gradient(135deg, #e11d48, #fda4af)",
  },
};

const App = memo(function App() {
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

  // سیستم تم رنگی
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("appTheme");
    return saved || "purple";
  });

  // تابع تغییر تم - بهینه‌سازی با useCallback
  const changeTheme = useCallback((themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem("appTheme", themeName);

    // به‌روزرسانی CSS variables
    const themeData = colorThemes[themeName];
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", themeData.primary);
    root.style.setProperty("--theme-primary-light", themeData.primaryLight);
    root.style.setProperty("--theme-secondary", themeData.secondary);
    root.style.setProperty("--theme-accent", themeData.accent);
    root.style.setProperty("--theme-background", themeData.background);
    root.style.setProperty("--theme-border", themeData.border);
    root.style.setProperty("--theme-text", themeData.text);
    root.style.setProperty("--theme-gradient", themeData.gradient);
    root.style.setProperty("--theme-gradient-button", themeData.gradientButton);
  }, []);

  // اعمال تم در شروع
  useEffect(() => {
    changeTheme(currentTheme);
  }, [currentTheme, changeTheme]);

  // محاسبه theme با useMemo
  const theme = useMemo(() => colorThemes[currentTheme], [currentTheme]);

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

  // لیست همه عکس‌ها (پیش‌فرض + سفارشی) - بهینه‌سازی با useMemo
  const allImages = useMemo(
    () => [...defaultImages, ...customImages],
    [defaultImages, customImages]
  );

  // استفاده از custom hook برای window size
  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    localStorage.setItem("bgIndex", bgIndex);
  }, [bgIndex]);

  // ریف و افکت vanilla-tilt برای کارت خوش آمدید
  const welcomeRef = useRef(null);
  useEffect(() => {
    if (welcomeRef.current) {
      VanillaTilt.init(welcomeRef.current, WELCOME_TILT_CONFIG);
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
          algorithm: antTheme.darkAlgorithm,
          token: {
            colorPrimary: theme.primary,
          },
          components: {
            Modal: {
              colorPrimary: theme.primary,
            },
            Button: {
              colorPrimary: theme.primary,
            },
            Input: {
              colorPrimary: theme.primary,
            },
            Select: {
              colorPrimary: theme.primary,
            },
          },
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
                <span
                  className="text-4xl font-extrabold my-5 block"
                  style={{ color: theme.primary }}
                >
                  تب‌یار
                </span>
                خوش آمدید😍
              </div>
              <div className="flex flex-col items-center gap-4">
                <Suspense fallback={<ComponentLoader />}>
                  <AnalogClock />
                </Suspense>
                <Suspense fallback={<ComponentLoader />}>
                  <DigitalClock />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Grid Area 2: بخش وسط - کارت‌های بوکمارک */}
        <div
          className="z-10"
          style={{ gridArea: "center", alignSelf: "start" }}
        >
          <Suspense fallback={<ComponentLoader />}>
            <BookmarkCards />
          </Suspense>
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
          <Suspense fallback={<ComponentLoader />}>
            <TodoList />
          </Suspense>
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
                  <Suspense fallback={<ComponentLoader />}>
                    <AnalogClock />
                  </Suspense>
                </div>
                <div style={{ transform: "scale(1.1)" }}>
                  <Suspense fallback={<ComponentLoader />}>
                    <DigitalClock />
                  </Suspense>
                </div>
              </div>
            )}
            <Suspense fallback={<ComponentLoader />}>
              <CalendarWidget currentTheme={currentTheme} />
            </Suspense>
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
                  className={`w-5 h-5 rounded-lg border cursor-pointer overflow-hidden transition`}
                  style={{
                    borderColor: bgIndex === idx ? theme.accent : "transparent",
                    boxShadow:
                      bgIndex === idx ? `0 0 0 1px ${theme.accent}` : "none",
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
              className={`w-5 h-5 flex items-center justify-center rounded-lg border border-dashed cursor-pointer bg-black/40 hover:bg-black/60 transition ${
                allImages.length >= 15 ? "opacity-50 pointer-events-none" : ""
              }`}
              style={{
                borderColor: theme.primary,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <span
                className="text-xl font-bold mt-1"
                style={{ color: theme.primary }}
              >
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

            {/* دکمه انتخاب تم */}
            <div className="relative ml-2">
              <button
                className="w-9 h-5 flex items-center justify-center rounded-lg border cursor-pointer bg-black/40 hover:bg-black/60 transition"
                style={{
                  borderColor: theme.accent,
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
                title="تغییر تم رنگی"
                onClick={() => {
                  const themeKeys = Object.keys(colorThemes);
                  const currentIndex = themeKeys.indexOf(currentTheme);
                  const nextIndex = (currentIndex + 1) % themeKeys.length;
                  changeTheme(themeKeys[nextIndex]);
                }}
              >
                <span className="text-[10px]" style={{ color: theme.accent }}>
                  🎨
                </span>
              </button>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
});

export default App;
