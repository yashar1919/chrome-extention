import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  DragOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  DownOutlined,
  RightOutlined,
  UpOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Input,
  Button,
  message,
  Popconfirm,
  Select,
  theme,
  ConfigProvider,
} from "antd";
import VanillaTilt from "vanilla-tilt";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// مجموعه آیکون‌های معروف سایت‌ها
const siteIcons = {
  // گوگل سرویس‌ها
  google: { name: "گوگل", emoji: "🔍", category: "search" },
  gmail: { name: "جیمیل", emoji: "📧", category: "email" },
  drive: { name: "گوگل درایو", emoji: "☁️", category: "storage" },
  meet: { name: "گوگل میت", emoji: "📹", category: "communication" },
  maps: { name: "گوگل مپس", emoji: "🗺️", category: "travel" },
  translate: { name: "گوگل ترنسلیت", emoji: "🌍", category: "tools" },
  youtube: { name: "یوتیوب", emoji: "📺", category: "entertainment" },
  photos: { name: "گوگل فوتوز", emoji: "📸", category: "storage" },
  calendar: { name: "گوگل کلندر", emoji: "📅", category: "productivity" },
  docs: { name: "گوگل داکس", emoji: "📄", category: "productivity" },
  sheets: { name: "گوگل شیتس", emoji: "📊", category: "productivity" },

  // شبکه‌های اجتماعی
  linkedin: { name: "لینکدین", emoji: "👔", category: "social" },
  twitter: { name: "توییتر", emoji: "🐦", category: "social" },
  facebook: { name: "فیسبوک", emoji: "📘", category: "social" },
  instagram: { name: "اینستاگرام", emoji: "📷", category: "social" },
  telegram: { name: "تلگرام", emoji: "✈️", category: "communication" },
  whatsapp: { name: "واتساپ", emoji: "💬", category: "communication" },
  discord: { name: "دیسکورد", emoji: "🎮", category: "communication" },
  reddit: { name: "ردیت", emoji: "🔴", category: "social" },
  pinterest: { name: "پینترست", emoji: "📌", category: "social" },
  tiktok: { name: "تیک‌تاک", emoji: "🎵", category: "entertainment" },

  // ابزارهای کاری
  github: { name: "گیت‌هاب", emoji: "👨‍💻", category: "development" },
  gitlab: { name: "گیت‌لب", emoji: "🦊", category: "development" },
  stackoverflow: { name: "استک‌اورفلو", emoji: "💻", category: "development" },
  slack: { name: "اسلک", emoji: "💼", category: "productivity" },
  notion: { name: "نوشن", emoji: "📝", category: "productivity" },
  trello: { name: "ترلو", emoji: "📋", category: "productivity" },
  asana: { name: "آسانا", emoji: "✅", category: "productivity" },
  jira: { name: "جیرا", emoji: "🎯", category: "productivity" },

  // طراحی و توسعه
  figma: { name: "فیگما", emoji: "📐", category: "design" },
  canva: { name: "کنوا", emoji: "🖌️", category: "design" },
  adobe: { name: "ادوبی", emoji: "🎨", category: "design" },
  behance: { name: "بیهنس", emoji: "🎭", category: "design" },
  dribbble: { name: "دریبل", emoji: "🏀", category: "design" },
  codepen: { name: "کدپن", emoji: "💻", category: "development" },

  // فروشگاه‌ها
  amazon: { name: "آمازون", emoji: "📦", category: "shopping" },
  ebay: { name: "ایبی", emoji: "🏪", category: "shopping" },
  alibaba: { name: "علی‌بابا", emoji: "🛒", category: "shopping" },
  digikala: { name: "دیجی‌کالا", emoji: "🛒", category: "shopping" },
  torob: { name: "ترب", emoji: "🔍", category: "shopping" },

  // سرگرمی
  netflix: { name: "نتفلیکس", emoji: "🎬", category: "entertainment" },
  spotify: { name: "اسپاتیفای", emoji: "🎵", category: "entertainment" },
  twitch: { name: "توییچ", emoji: "🎮", category: "entertainment" },
  steam: { name: "استیم", emoji: "🎮", category: "entertainment" },
  aparat: { name: "آپارات", emoji: "📺", category: "entertainment" },
  namava: { name: "نماوا", emoji: "🎬", category: "entertainment" },

  // ابزارها
  dropbox: { name: "دراپ‌باکس", emoji: "📁", category: "storage" },
  onedrive: { name: "وان‌درایو", emoji: "💾", category: "storage" },
  zoom: { name: "زوم", emoji: "📹", category: "communication" },
  skype: { name: "اسکایپ", emoji: "☎️", category: "communication" },

  // هوش مصنوعی
  openai: { name: "اوپن‌ای‌آی", emoji: "🤖", category: "ai" },
  claude: { name: "کلود", emoji: "🤖", category: "ai" },
  deepseek: { name: "دیپ‌سیک", emoji: "🧠", category: "ai" },
  perplexity: { name: "پرپلکسیتی", emoji: "🔍", category: "ai" },

  // سایت‌های فارسی
  jobinja: { name: "جابینجا", emoji: "💼", category: "job" },
  snappfood: { name: "اسنپ‌فود", emoji: "🍕", category: "food" },
  tapsi: { name: "تپسی", emoji: "🚗", category: "transport" },
  virgool: { name: "ویرگول", emoji: "📖", category: "blog" },
  vajehyab: { name: "واژه‌یاب", emoji: "📖", category: "tools" },

  // پرداخت
  paypal: { name: "پی‌پال", emoji: "💰", category: "payment" },
  stripe: { name: "استرایپ", emoji: "💳", category: "payment" },

  // حمل و نقل
  uber: { name: "اوبر", emoji: "🚗", category: "transport" },
  airbnb: { name: "ایربی‌ان‌بی", emoji: "🏠", category: "travel" },
  booking: { name: "بوکینگ", emoji: "✈️", category: "travel" },

  // آموزش
  coursera: { name: "کورسرا", emoji: "🎓", category: "education" },
  udemy: { name: "یودمی", emoji: "🧑‍🏫", category: "education" },
  khan: { name: "خان آکادمی", emoji: "📚", category: "education" },
  codecademy: { name: "کدآکادمی", emoji: "💻", category: "education" },

  // عکس و ویدیو
  unsplash: { name: "آن‌اسپلش", emoji: "📸", category: "media" },
  pexels: { name: "پکسلز", emoji: "📷", category: "media" },
  vimeo: { name: "ویمیو", emoji: "🎬", category: "media" },

  // توسعه
  vercel: { name: "ورسل", emoji: "▲", category: "development" },
  netlify: { name: "نتلیفای", emoji: "🌐", category: "development" },
  heroku: { name: "هروکو", emoji: "🚀", category: "development" },
  firebase: { name: "فایربیس", emoji: "🔥", category: "development" },
  aws: { name: "آمازون وب سرویس", emoji: "☁️", category: "development" },
  docker: { name: "داکر", emoji: "🐳", category: "development" },

  // خبر
  bbc: { name: "بی‌بی‌سی", emoji: "📺", category: "news" },
  cnn: { name: "سی‌ان‌ان", emoji: "📺", category: "news" },
  isna: { name: "ایسنا", emoji: "📰", category: "news" },
  farsnews: { name: "فارس نیوز", emoji: "📰", category: "news" },

  // عمومی
  wikipedia: { name: "ویکی‌پدیا", emoji: "📜", category: "reference" },
  medium: { name: "مدیوم", emoji: "📖", category: "blog" },
};

// دسته‌بندی آیکون‌ها
const iconCategories = {
  all: "همه",
  social: "شبکه‌های اجتماعی",
  productivity: "بهره‌وری",
  development: "توسعه",
  design: "طراحی",
  entertainment: "سرگرمی",
  shopping: "خرید",
  communication: "ارتباطات",
  storage: "ذخیره‌سازی",
  education: "آموزش",
  news: "اخبار",
  tools: "ابزار",
  ai: "هوش مصنوعی",
  job: "شغل",
  payment: "پرداخت",
  transport: "حمل و نقل",
  travel: "سفر",
  food: "غذا",
  media: "رسانه",
  blog: "وبلاگ",
  reference: "مرجع",
  search: "جستجو",
  email: "ایمیل",
};

// کامپوننت FolderCard - بهینه‌سازی با memo
const FolderCard = memo(
  ({
    folder,
    onToggle,
    onEdit,
    onDelete,
    bookmarksCount,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
  }) => {
    return (
      <div className="">
        {/* هدر فولدر */}
        <div
          /* className="rounded-t-xl p-3 text-white cursor-pointer group hover:border-purple-400/50 transition-all duration-300 flex items-center justify-between w-full folder-header" */
          className={`${
            folder.isOpen ? "rounded-t-xl" : "rounded-xl"
          } p-3 text-white cursor-pointer group transition-all duration-300 flex items-center justify-between w-full folder-header`}
          onClick={() => onToggle(folder.id)}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // بک‌گراند تیره‌تر
            backdropFilter: "blur(20px)", // blur بیشتر برای فولدرها
            border: "1px solid var(--theme-border)",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "var(--theme-border)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "var(--theme-border)";
          }}
        >
          <div className="flex items-center gap-3">
            {/* آیکون باز/بسته */}
            <div
              className={`folder-icon-transition ${
                folder.isOpen ? "open" : ""
              }`}
            >
              <RightOutlined
                className="text-sm"
                style={{ color: "var(--theme-secondary)" }}
              />
            </div>

            {/* آیکون فولدر */}
            <span className="text-xl transition-colors duration-300">
              {folder.isOpen ? <FolderOpenOutlined /> : <FolderOutlined />}
            </span>

            {/* نام فولدر */}
            <h3 className="font-bold" style={{ color: "var(--theme-text)" }}>
              {folder.title}
            </h3>

            {/* تعداد bookmark ها */}
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                color: "var(--theme-secondary)",
                backgroundColor: "var(--theme-background)",
              }}
            >
              {bookmarksCount}
            </span>
          </div>

          {/* دکمه‌های حرکت، ویرایش و حذف فولدر */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* دکمه حرکت بالا */}
            <Button
              size="small"
              type="text"
              icon={<UpOutlined style={{ fontSize: "12px" }} />}
              className={`${
                isFirst
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-green-400 hover:text-green-300 hover:bg-green-400/20"
              }`}
              disabled={isFirst}
              onClick={(e) => {
                e.stopPropagation();
                if (!isFirst) {
                  onMoveUp(folder.id);
                }
              }}
            />

            {/* دکمه حرکت پایین */}
            <Button
              size="small"
              type="text"
              icon={<DownOutlined style={{ fontSize: "12px" }} />}
              className={`${
                isLast
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-green-400 hover:text-green-300 hover:bg-green-400/20"
              }`}
              disabled={isLast}
              onClick={(e) => {
                e.stopPropagation();
                if (!isLast) {
                  onMoveDown(folder.id);
                }
              }}
            />

            {/* دکمه ویرایش */}
            <Button
              size="small"
              type="text"
              icon={<EditOutlined style={{ fontSize: "12px" }} />}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(folder);
              }}
            />
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                components: {
                  Popconfirm: {
                    colorPrimary: "var(--theme-primary)",
                  },
                },
              }}
            >
              <Popconfirm
                title="حذف فولدر"
                description={`آیا از حذف فولدر "${folder.title}" اطمینان دارید؟ تمام بوکمارک‌های داخل آن آزاد خواهند شد.`}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onDelete(folder.id);
                }}
                onCancel={(e) => {
                  e?.stopPropagation();
                }}
                okText="حذف"
                cancelText="لغو"
              >
                <Button
                  size="small"
                  type="text"
                  icon={<DeleteOutlined style={{ fontSize: "12px" }} />}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </ConfigProvider>
          </div>
        </div>
      </div>
    );
  }
);

// تنظیمات VanillaTilt برای bookmark cards
const BOOKMARK_TILT_CONFIG = {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2,
  scale: 1.02,
};

// کامپوننت SortableBookmarkCard - بهینه‌سازی با memo
const SortableBookmarkCard = memo(
  ({
    bookmark,
    onEdit,
    onDelete,
    onClick,
    getIconElement,
    isInFolder = false,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: bookmark.id,
      disabled: false,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition:
        transition || "transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 9999 : 1,
    };

    const cardRef = useRef(null);

    useEffect(() => {
      if (cardRef.current && !isDragging) {
        VanillaTilt.init(cardRef.current, BOOKMARK_TILT_CONFIG);
      }

      return () => {
        if (cardRef.current && cardRef.current.vanillaTilt) {
          cardRef.current.vanillaTilt.destroy();
        }
      };
    }, [isDragging]);

    return (
      <div
        ref={(el) => {
          setNodeRef(el);
          cardRef.current = el;
        }}
        className={`glass-black rounded-xl p-1 text-white group transition-all duration-300 relative bookmark-card cursor-pointer ${
          isInFolder ? "folder-bookmark-card" : ""
        }`}
        style={{
          width: "110px",
          height: "90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          border: "1px solid var(--theme-border)",
          ...style,
        }}
        {...attributes}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-border)";
        }}
      >
        {/* دکمه Drag Handle - گوشه بالا سمت چپ */}
        <div
          {...listeners}
          className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing w-6 h-6 flex items-center justify-center rounded"
          style={{
            color: "var(--theme-secondary)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--theme-text)";
            e.target.style.backgroundColor = "var(--theme-background)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "var(--theme-secondary)";
            e.target.style.backgroundColor = "transparent";
          }}
        >
          <DragOutlined style={{ fontSize: "12px" }} />
        </div>
        {/* محتوای کارت */}
        <div
          className="flex flex-col items-center justify-center text-center w-full h-full"
          onClick={onClick}
        >
          {/* آیکون */}
          <div className="mb-2 bookmark-icon">
            {getIconElement(bookmark.icon)}
          </div>

          {/* عنوان */}
          <h3
            className="text-sm font-bold mb-1 line-clamp-1"
            style={{ color: "var(--theme-text)" }}
          >
            {bookmark.title}
          </h3>
        </div>

        {/* دکمه‌های ویرایش و حذف */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col pointer-events-auto">
          <Button
            size="small"
            type="text"
            icon={<EditOutlined style={{ fontSize: "12px" }} />}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 w-6 h-6 p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(bookmark);
            }}
          />
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              components: {
                Popconfirm: {
                  colorPrimary: "var(--theme-primary)",
                },
              },
            }}
          >
            <Popconfirm
              title="حذف بوکمارک"
              description="آیا از حذف این بوکمارک اطمینان دارید؟"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={(e) => {
                e?.stopPropagation();
                onDelete(bookmark.id);
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
              okText="حذف"
              cancelText="لغو"
            >
              <Button
                size="small"
                type="text"
                icon={<DeleteOutlined style={{ fontSize: "12px" }} />}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/20 w-6 h-6 p-0 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </ConfigProvider>
        </div>
      </div>
    );
  }
);

const BookmarkCards = memo(() => {
  // ساختار جدید: folders و bookmarks جداگانه
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem("folders");
    return saved
      ? JSON.parse(saved)
      : [{ id: "general", title: "عمومی", icon: "📁", isOpen: false }];
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved
      ? JSON.parse(saved)
      : [
          // بوکمارک‌های بدون فولدر
          {
            id: 1,
            title: "لینکدین",
            url: "https://linkedin.com",
            icon: "👔",
          },
          {
            id: 2,
            title: "گوگل ترنسلیت",
            url: "https://translate.google.com",
            icon: "🌍",
          },
          {
            id: 3,
            title: "واژه‌یاب",
            url: "https://vajehyab.com",
            icon: "🔍",
          },
          {
            id: 4,
            title: "Grok",
            url: "https://x.com/i/grok",
            icon: "🤖",
          },
          {
            id: 5,
            title: "YouTube",
            url: "https://youtube.com",
            icon: "📺",
          },
          {
            id: 6,
            title: "Gmail",
            url: "https://gmail.com",
            icon: "📧",
          },
          {
            id: 7,
            title: "Classco",
            url: "https://class-co.ir",
            icon: "💼",
          },
          // بوکمارک‌های فولدر عمومی
          {
            id: 8,
            title: "Google Drive",
            url: "https://drive.google.com",
            icon: "☁️",
            folderId: "general",
          },
          {
            id: 9,
            title: "Google Meet",
            url: "https://meet.google.com",
            icon: "📹",
            folderId: "general",
          },
          {
            id: 10,
            title: "جابینجا",
            url: "https://jobinja.ir",
            icon: "💼",
            folderId: "general",
          },
          {
            id: 11,
            title: "دیجی‌کالا",
            url: "https://digikala.com",
            icon: "🛒",
            folderId: "general",
          },
          {
            id: 12,
            title: "DeepSeek",
            url: "https://chat.deepseek.com",
            icon: "🧠",
            folderId: "general",
          },
          {
            id: 13,
            title: "Unsplash",
            url: "https://unsplash.com",
            icon: "📸",
            folderId: "general",
          },
        ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInsideFolder, setIsModalInsideFolder] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    icon: "",
    folderId: "",
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [activeFolder, setActiveFolder] = useState("general"); // فولدر فعال
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderForm, setFolderForm] = useState({ title: "", icon: "" });
  const [editingFolder, setEditingFolder] = useState(null); // فولدر در حال ادیت
  const [selectedCategory, setSelectedCategory] = useState("all"); // دسته‌بندی انتخاب شده
  const [showIconPicker, setShowIconPicker] = useState(false); // نمایش انتخابگر آیکون
  const [animatingFolders, setAnimatingFolders] = useState(new Set()); // فولدرهای در حال انیمیشن

  // تابع استخراج آیکون از URL سایت (ساده شده)
  const getFaviconFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase().replace(/^www\./, "");

      // جستجو در آیکون‌های موجود
      for (const [key, data] of Object.entries(siteIcons)) {
        if (domain.includes(key) || key.includes(domain.split(".")[0])) {
          return data.emoji;
        }
      }

      // بررسی کلمات کلیدی در domain
      const domainKeywords = {
        mail: "📧",
        email: "📧",
        chat: "💬",
        news: "📰",
        blog: "📖",
        shop: "🛒",
        store: "🏪",
        bank: "🏦",
        music: "🎵",
        video: "📺",
        photo: "📸",
        game: "🎮",
        learn: "📚",
        edu: "🎓",
        travel: "✈️",
        hotel: "🏨",
        food: "🍕",
        car: "🚗",
        drive: "☁️",
        cloud: "☁️",
        dev: "💻",
        code: "💻",
        git: "📝",
      };

      for (const [keyword, icon] of Object.entries(domainKeywords)) {
        if (domain.includes(keyword)) return icon;
      }

      // آیکون براساس TLD
      if (domain.endsWith(".ir")) return "🇮🇷";
      if (domain.endsWith(".edu")) return "🎓";
      if (domain.endsWith(".gov")) return "🏛️";
      return "🌐";
    } catch {
      return "🌐";
    }
  };

  // فانکشن handle تغییر drag and drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // فقط درون همان فولدر reorder می‌کنیم
      const activeBookmark = bookmarks.find((b) => b.id === active.id);
      const overBookmark = bookmarks.find((b) => b.id === over.id);

      // چک کردن که هر دو bookmark در همان محیط هستند (هر دو با فولدر یا هر دو بدون فولدر)
      const activeFolder = activeBookmark?.folderId || null;
      const overFolder = overBookmark?.folderId || null;

      if (activeBookmark && overBookmark && activeFolder === overFolder) {
        setBookmarks((items) => {
          const sameContext = items.filter(
            (item) => (item.folderId || null) === activeFolder
          );
          const otherContexts = items.filter(
            (item) => (item.folderId || null) !== activeFolder
          );

          const oldIndex = sameContext.findIndex(
            (item) => item.id === active.id
          );
          const newIndex = sameContext.findIndex((item) => item.id === over.id);

          const reorderedSameContext = arrayMove(
            sameContext,
            oldIndex,
            newIndex
          );
          const newBookmarks = [...otherContexts, ...reorderedSameContext];

          localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
          return newBookmarks;
        });
      }
    }
  };

  // ست کردن DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // فاصله کمتری برای شروع drag
        delay: 100, // تاخیر کوتاه برای جلوگیری از drag تصادفی
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // با CSS Grid دیگه نیازی به positioning پیچیده نیست

  // ذخیره در localStorage
  // ذخیره folders و bookmarks در localStorage
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // توابع مدیریت فولدر
  const toggleFolder = (folderId) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder
      )
    );
  };

  // تابع حرکت فولدر بالا
  const moveFolderUp = (folderId) => {
    const currentIndex = folders.findIndex((f) => f.id === folderId);
    if (currentIndex <= 0) return; // اگر اولین فولدر باشه، تغییری نده

    const previousFolderId = folders[currentIndex - 1].id;

    // شروع انیمیشن
    setAnimatingFolders(new Set([folderId, previousFolderId]));

    // اجرای تغییر ترتیب با تاخیر کوتاه
    setTimeout(() => {
      setFolders((prev) => {
        const newFolders = [...prev];
        [newFolders[currentIndex - 1], newFolders[currentIndex]] = [
          newFolders[currentIndex],
          newFolders[currentIndex - 1],
        ];
        return newFolders;
      });

      // پایان انیمیشن
      setTimeout(() => {
        setAnimatingFolders(new Set());
      }, 100);
    }, 150);

    messageApi.success("ترتیب فولدر تغییر کرد");
  };

  // تابع حرکت فولدر پایین
  const moveFolderDown = (folderId) => {
    const currentIndex = folders.findIndex((f) => f.id === folderId);
    if (currentIndex >= folders.length - 1) return; // اگر آخرین فولدر باشه، تغییری نده

    const nextFolderId = folders[currentIndex + 1].id;

    // شروع انیمیشن
    setAnimatingFolders(new Set([folderId, nextFolderId]));

    // اجرای تغییر ترتیب با تاخیر کوتاه
    setTimeout(() => {
      setFolders((prev) => {
        const newFolders = [...prev];
        [newFolders[currentIndex], newFolders[currentIndex + 1]] = [
          newFolders[currentIndex + 1],
          newFolders[currentIndex],
        ];
        return newFolders;
      });

      // پایان انیمیشن
      setTimeout(() => {
        setAnimatingFolders(new Set());
      }, 100);
    }, 150);

    messageApi.success("ترتیب فولدر تغییر کرد");
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setFolderForm({
      title: folder.title,
      icon: folder.icon,
    });
    setShowFolderModal(true);
  };

  const createFolder = () => {
    if (!folderForm.title.trim()) {
      messageApi.error("لطفاً نام فولدر را وارد کنید");
      return;
    }

    if (editingFolder) {
      // ویرایش فولدر موجود
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === editingFolder.id
            ? {
                ...folder,
                title: folderForm.title.trim(),
                icon: folderForm.icon || "📁",
              }
            : folder
        )
      );
      setShowFolderModal(false);
      setEditingFolder(null);
      setFolderForm({ title: "", icon: "" });
      messageApi.success("فولدر با موفقیت ویرایش شد");
    } else {
      // ساخت فولدر جدید
      const newFolder = {
        id: `folder_${Date.now()}`,
        title: folderForm.title.trim(),
        icon: folderForm.icon || "📁",
        isOpen: true,
      };

      // بررسی محدودیت ذخیره‌سازی براساس حجم مرورگر
      const testFolders = [...folders, newFolder];
      const testData = JSON.stringify(testFolders);

      try {
        // تست localStorage
        const testKey = `folders_test_${Date.now()}`;
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);

        setFolders((prev) => [...prev, newFolder]);
        setShowFolderModal(false);
        setFolderForm({ title: "", icon: "" });
        messageApi.success("فولدر جدید ساخته شد");
      } catch (error) {
        // محاسبه تقریبی حجم
        const currentSize = JSON.stringify(folders).length;
        const approximateSize = Math.round(currentSize / 1024);

        console.warn("localStorage full:", error.message);

        messageApi.error(
          `حجم ذخیره‌سازی مرورگر پر شده است! (تقریباً ${approximateSize}KB استفاده شده)\n` +
            "لطفاً برخی از فولدرها یا بوکمارک‌ها را حذف کنید."
        );
      }
    }
  };

  const deleteFolder = (folderId) => {
    // انتقال bookmarks فولدر به بدون فولدر (حذف folderId)
    setBookmarks((prev) =>
      prev.map((bookmark) => {
        if (bookmark.folderId === folderId) {
          const { folderId: _removed, ...bookmarkWithoutFolder } = bookmark;
          return bookmarkWithoutFolder;
        }
        return bookmark;
      })
    );

    // حذف فولدر
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    messageApi.success("فولدر حذف شد و بوکمارک‌ها آزاد شدند");
  };

  // فیلتر bookmarks بر اساس فولدر - بهینه‌سازی با useCallback
  const getBookmarksByFolder = useCallback(
    (folderId) => {
      return bookmarks.filter((bookmark) => bookmark.folderId === folderId);
    },
    [bookmarks]
  );

  // گرفتن bookmarks بدون فولدر (null یا undefined) - بهینه‌سازی با useCallback
  const getBookmarksWithoutFolder = useCallback(() => {
    return bookmarks.filter((bookmark) => !bookmark.folderId);
  }, [bookmarks]);

  const handleOpenModal = (
    bookmark = null,
    isInsideFolder = false,
    specificFolderId = null
  ) => {
    if (bookmark) {
      setEditingBookmark(bookmark);
      setForm({
        title: bookmark.title,
        url: bookmark.url,
        icon: bookmark.icon,
        folderId: bookmark.folderId || "",
      });
      setIsModalInsideFolder(false); // برای ادیت، همیشه فولدر نشون بده
    } else {
      setEditingBookmark(null);
      const targetFolderId = specificFolderId || activeFolder || "";
      setForm({
        title: "",
        url: "",
        icon: "",
        folderId: targetFolderId,
      });
      setIsModalInsideFolder(isInsideFolder); // تنظیم حالت مودال

      // اگر از داخل فولدر خاص فراخوانی شده، activeFolder رو هم آپدیت کن
      if (specificFolderId) {
        setActiveFolder(specificFolderId);
      }
    }
    setShowIconPicker(false); // بستن انتخابگر آیکون
    setSelectedCategory("all"); // ریست کردن دسته‌بندی
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.url.trim()) {
      messageApi.error("لطفاً عنوان و آدرس را وارد کنید");
      return;
    }

    // بررسی فرمت URL
    let url = form.url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // تعیین آیکون: اگر کاربر آیکون انتخاب نکرده، از سایت استخراج کن
    const finalIcon = form.icon.trim() || getFaviconFromUrl(url);

    // بررسی محدودیت ذخیره‌سازی براساس حجم مرورگر
    if (!editingBookmark) {
      const newBookmark = {
        id: Date.now(),
        ...form,
        url,
        icon: finalIcon,
      };

      if (form.folderId) {
        newBookmark.folderId = form.folderId;
      }

      // تست ذخیره‌سازی
      const testBookmarks = [...bookmarks, newBookmark];
      const testData = JSON.stringify(testBookmarks);

      try {
        // تست localStorage
        const testKey = `bookmarks_test_${Date.now()}`;
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
      } catch (error) {
        // محاسبه تقریبی حجم
        const currentSize = JSON.stringify(bookmarks).length;
        const approximateSize = Math.round(currentSize / 1024);

        console.warn("localStorage full:", error.message);

        messageApi.error(
          `حجم ذخیره‌سازی مرورگر پر شده است! (تقریباً ${approximateSize}KB استفاده شده)\n` +
            "لطفاً برخی از بوکمارک‌های قدیمی را حذف کنید."
        );
        return;
      }
    }

    if (editingBookmark) {
      // ویرایش
      setBookmarks((prev) =>
        prev.map((bookmark) =>
          bookmark.id === editingBookmark.id
            ? { ...bookmark, ...form, url, icon: finalIcon }
            : bookmark
        )
      );
      messageApi.success("بوکمارک با موفقیت ویرایش شد");
    } else {
      // افزودن جدید
      const newBookmark = {
        id: Date.now(),
        ...form,
        url,
        icon: finalIcon,
      };

      // فقط اگر فولدری انتخاب شده باشه folderId اضافه کن
      if (form.folderId) {
        newBookmark.folderId = form.folderId;
      }
      setBookmarks((prev) => [...prev, newBookmark]);
      messageApi.success("بوکمارک جدید اضافه شد");
    }

    setIsModalOpen(false);
    setIsModalInsideFolder(false); // ریست کردن حالت مودال
    setShowIconPicker(false); // بستن انتخابگر آیکون
    setSelectedCategory("all"); // ریست کردن دسته‌بندی
    setForm({ title: "", url: "", icon: "", folderId: "" });
  };

  const handleDelete = useCallback(
    (id) => {
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      messageApi.success("بوکمارک حذف شد");
    },
    [messageApi]
  );

  const handleCardClick = useCallback((url) => {
    window.open(url, "_blank");
  }, []);

  const getIconElement = useCallback((icon) => {
    if (!icon)
      return (
        <GlobalOutlined
          className="text-2xl"
          style={{ color: "var(--theme-secondary)" }}
        />
      );

    // بررسی ایموجی‌ها با regex جامع‌تر
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{303D}]|[\u{00A9}]|[\u{00AE}]|[\u{2122}]|[\u{23F3}]|[\u{24C2}]|[\u{23F0}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2620}]|[\u{2622}]|[\u{2623}]|[\u{2626}]|[\u{262A}]|[\u{262E}]|[\u{262F}]|[\u{2638}-\u{263A}]|[\u{2640}]|[\u{2642}]|[\u{2648}-\u{2653}]|[\u{265F}-\u{2660}]|[\u{2663}]|[\u{2665}-\u{2666}]|[\u{2668}]|[\u{267B}]|[\u{267E}-\u{267F}]|[\u{2692}-\u{2697}]|[\u{2699}]|[\u{269B}-\u{269C}]|[\u{26A0}-\u{26A1}]|[\u{26A7}]|[\u{26AA}-\u{26AB}]|[\u{26B0}-\u{26B1}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26C8}]|[\u{26CE}]|[\u{26CF}]|[\u{26D1}]|[\u{26D3}-\u{26D4}]|[\u{26E9}-\u{26EA}]|[\u{26F0}-\u{26F5}]|[\u{26F7}-\u{26FA}]|[\u{26FD}]/u;

    if (emojiRegex.test(icon)) {
      return <span className="text-2xl">{icon}</span>;
    }

    // اگر تک کاراکتر است (ممکن است ایموجی ساده باشد)
    if (icon.length <= 2) {
      return <span className="text-2xl">{icon}</span>;
    }

    // در غیر این صورت آیکون پیش‌فرض
    return (
      <GlobalOutlined
        className="text-2xl"
        style={{ color: "var(--theme-secondary)" }}
      />
    );
  }, []);

  return (
    <>
      {contextHolder}
      {/* کانتینر ساده برای کارت‌های بوکمارک */}
      <div
        className="h-full overflow-y-auto custom-scrollbar p-2"
        style={{
          maxHeight: "calc(100vh - 80px)",
          borderRadius: "12px",
        }}
      >
        {/* بوکمارک‌های بدون فولدر */}
        {(() => {
          const withoutFolderBookmarks = getBookmarksWithoutFolder();
          if (withoutFolderBookmarks.length > 0) {
            return (
              <div className="mb-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={withoutFolderBookmarks.map((b) => b.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div
                      className="grid gap-3 mb-4"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(100px, 110px))",
                        justifyContent: "center",
                        maxWidth: "90%",
                        overflow: "hidden",
                        margin: "0 auto",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                    >
                      {/* کارت‌های بوکمارک بدون فولدر */}
                      {withoutFolderBookmarks.map((bookmark) => (
                        <SortableBookmarkCard
                          key={bookmark.id}
                          bookmark={bookmark}
                          onEdit={handleOpenModal}
                          onDelete={handleDelete}
                          onClick={() => handleCardClick(bookmark.url)}
                          getIconElement={getIconElement}
                        />
                      ))}

                      {/* کارت افزودن بوکمارک بدون فولدر */}
                      <div
                        className="glass-black rounded-xl p-4 text-white cursor-pointer border-dashed transition-all duration-300 group"
                        style={{
                          width: "110px",
                          height: "90px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          borderColor: "var(--theme-border)",
                          backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = "var(--theme-secondary)";
                          e.target.style.backgroundColor =
                            "var(--theme-background)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = "var(--theme-border)";
                          e.target.style.backgroundColor = "rgba(0,0,0,0.3)";
                        }}
                        onClick={() => {
                          setActiveFolder(null); // بدون فولدر
                          handleOpenModal(null, false); // false = خارج از فولدر
                        }}
                      >
                        <PlusOutlined
                          className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
                          style={{ color: "var(--theme-secondary)" }}
                        />
                        <p
                          id="background-color-none"
                          className="font-medium text-xs"
                          style={{ color: "var(--theme-text)" }}
                        >
                          افزودن بوکمارک
                        </p>
                      </div>
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            );
          }
          return null;
        })()}

        {/* کارت افزودن بوکمارک اگر هیچ بوکمارک بدون فولدری نیست */}
        {getBookmarksWithoutFolder().length === 0 && (
          <div className="mb-6">
            <div
              className="glass-black rounded-xl p-4 text-white cursor-pointer border-dashed transition-all duration-300 group"
              style={{
                width: "110px",
                height: "90px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                margin: "0 auto",
                borderColor: "var(--theme-border)",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "var(--theme-secondary)";
                e.target.style.backgroundColor = "var(--theme-background)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "var(--theme-border)";
                e.target.style.backgroundColor = "rgba(0,0,0,0.3)";
              }}
              onClick={() => {
                setActiveFolder(null); // بدون فولدر
                handleOpenModal(null, false); // false = خارج از فولدر
              }}
            >
              <PlusOutlined
                className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
                style={{ color: "var(--theme-secondary)" }}
              />
              <p
                className="font-medium text-xs"
                id="background-color-none"
                style={{ color: "var(--theme-text)" }}
              >
                افزودن بوکمارک
              </p>
            </div>
          </div>
        )}

        {/* نمایش فولدرها */}
        {folders.map((folder, index) => {
          const folderBookmarks = getBookmarksByFolder(folder.id);

          return (
            <div
              key={folder.id}
              className={`mb-6 folder-container ${
                animatingFolders.has(folder.id) ? "folder-animating" : ""
              }`}
              style={{
                transition:
                  "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
                transform: animatingFolders.has(folder.id)
                  ? "scale(1.02)"
                  : "scale(1)",
                opacity: animatingFolders.has(folder.id) ? "0.8" : "1",
              }}
            >
              {/* هدر فولدر - هم‌تراز با grid بوکمارک‌ها */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 110px))",
                  justifyContent: "center",
                  maxWidth: "90%",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <div className="col-span-full">
                  <FolderCard
                    folder={folder}
                    onToggle={toggleFolder}
                    onEdit={handleEditFolder}
                    onDelete={deleteFolder}
                    onMoveUp={moveFolderUp}
                    onMoveDown={moveFolderDown}
                    isFirst={index === 0}
                    isLast={index === folders.length - 1}
                    bookmarksCount={folderBookmarks.length}
                  />
                </div>
              </div>

              {/* محتوای فولدر (با انیمیشن accordion) */}
              <div
                className={`accordion-content ${
                  folder.isOpen ? "open" : "closed"
                }`}
                style={{
                  maxHeight: folder.isOpen ? "2000px" : "0",
                  paddingTop: "0",
                  paddingBottom: folder.isOpen ? "1px" : "0",
                }}
              >
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(100px, 110px))",
                    justifyContent: "center",
                    maxWidth: "90%",
                    overflow: "hidden",
                    margin: "0 auto",
                  }}
                >
                  <div className="col-span-full">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={folderBookmarks.map((b) => b.id)}
                        strategy={rectSortingStrategy}
                      >
                        <div className="folder-bookmark-container">
                          <div
                            className="grid gap-3"
                            style={{
                              gridTemplateColumns: "repeat(auto-fill, 110px)",
                              justifyContent: "center",
                            }}
                          >
                            {/* کارت‌های بوکمارک این فولدر */}
                            {folderBookmarks.map((bookmark) => (
                              <SortableBookmarkCard
                                key={bookmark.id}
                                bookmark={bookmark}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                                onClick={() => handleCardClick(bookmark.url)}
                                getIconElement={getIconElement}
                                isInFolder={true}
                              />
                            ))}

                            {/* کارت افزودن بوکمارک جدید */}
                            <div
                              className="glass-black rounded-xl p-4 text-white cursor-pointer border-dashed transition-all duration-300 group"
                              style={{
                                width: "110px",
                                height: "90px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                borderColor: "var(--theme-border)",
                                backgroundColor: "rgba(0,0,0,0.3)",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.borderColor =
                                  "var(--theme-secondary)";
                                e.target.style.backgroundColor =
                                  "var(--theme-background)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.borderColor =
                                  "var(--theme-border)";
                                e.target.style.backgroundColor =
                                  "rgba(0,0,0,0.3)";
                              }}
                              onClick={() => {
                                handleOpenModal(null, true, folder.id); // true = داخل فولدر، folder.id = فولدر هدف
                              }}
                            >
                              <PlusOutlined
                                className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"
                                style={{ color: "var(--theme-secondary)" }}
                              />
                              <p
                                className="font-medium text-xs"
                                style={{ color: "var(--theme-text)" }}
                                id="background-color-none"
                              >
                                افزودن بوکمارک
                              </p>
                            </div>
                          </div>
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* دکمه افزودن فولدر جدید */}
        <div className="mt-6 flex justify-center">
          <div
            className="relative cursor-pointer group"
            onClick={() => {
              setEditingFolder(null);
              setFolderForm({ title: "", icon: "" });
              setShowFolderModal(true);
            }}
          >
            {/* پس‌زمینه blur */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg transform group-hover:scale-110 transition-all duration-300"></div> */}

            {/* کانتینر اصلی */}
            <div
              className="relative backdrop-blur-xl rounded-2xl px-5 py-2 transition-all duration-300"
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid var(--theme-border)",
              }}
              /* onMouseEnter={(e) => {
                e.target.style.borderColor = "var(--theme-secondary)";
                e.target.style.backgroundColor = "rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "var(--theme-border)";
                e.target.style.backgroundColor = "rgba(0,0,0,0.4)";
              }} */
            >
              <div
                className="flex items-center justify-center gap-3"
                id="background-color-none"
              >
                {/* آیکون */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: "var(--theme-gradient)",
                  }}
                >
                  <PlusOutlined
                    className="text-white text-lg"
                    id="svg-color-plus-icon-antd-for-add-new-folder"
                  />
                </div>

                {/* متن */}
                <div className="text-center">
                  <span
                    className="text-[15px] transition-colors duration-300 text-white hover:text-[var(--theme-text)]"
                    id="background-color-none"
                    //style={{ color: "var(--theme-text)" }}
                  >
                    افزودن فولدر جدید
                  </span>
                </div>
              </div>

              {/* خط نور */}
              {/* <div 
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, transparent, var(--theme-secondary), transparent)`,
                }}
              ></div> */}
            </div>
          </div>
        </div>
      </div>

      {/* مودال افزودن/ویرایش */}
      <Modal
        title={null}
        open={isModalOpen}
        onOk={null}
        onCancel={null}
        footer={null}
        closeIcon={null}
        centered
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // تیره‌تر
          backdropFilter: "blur(5px)", // blur بیشتر
          WebkitBackdropFilter: "blur(5px)", // سازگاری با webkit
        }}
        styles={{
          body: { direction: "rtl" },
        }}
      >
        <div className="space-y-4" style={{ direction: "rtl" }}>
          {/* عنوان سفارشی */}
          <div className="text-center mb-6">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--theme-secondary)" }}
            >
              {editingBookmark ? "ویرایش بوکمارک" : "افزودن بوکمارک جدید"}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">عنوان</label>
            <Input
              placeholder="مثال: گوگل"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              آدرس وب سایت
            </label>
            <Input
              placeholder="مثال: google.com یا https://google.com"
              value={form.url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>

          {/* بخش انتخاب فولدر - فقط وقتی از خارج فولدر اضافه می‌کنیم */}
          {!isModalInsideFolder && (
            <div>
              <label className="block text-sm font-medium mb-1">فولدر</label>
              <Select
                value={form.folderId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, folderId: value }))
                }
                placeholder="انتخاب فولدر"
                style={{ width: "100%" }}
                allowClear
              >
                <Select.Option key="no-folder" value="">
                  <span style={{ marginLeft: "8px" }}>📌</span>
                  بدون فولدر
                </Select.Option>
                {folders.map((folder) => (
                  <Select.Option key={folder.id} value={folder.id}>
                    <span style={{ marginLeft: "8px" }}>{folder.icon}</span>
                    {folder.title}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* نمایش فولدر انتخاب شده وقتی از داخل فولدر اضافه می‌کنیم */}
          {isModalInsideFolder && activeFolder && (
            <div>
              <label className="block text-sm font-medium mb-1">
                فولدر انتخاب شده
              </label>
              <div
                className="p-2 rounded border"
                style={{
                  backgroundColor: "var(--theme-background)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)",
                }}
              >
                <span style={{ marginLeft: "8px" }}>
                  {folders.find((f) => f.id === activeFolder)?.icon || "📁"}
                </span>
                {folders.find((f) => f.id === activeFolder)?.title || "فولدر"}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              آیکون (اختیاری)
              {form.url && !form.icon && (
                <span className="text-purple-400 text-sm ml-2">
                  پیشنهادی:{" "}
                  {getFaviconFromUrl(
                    form.url.startsWith("http")
                      ? form.url
                      : `https://${form.url}`
                  )}
                </span>
              )}
            </label>

            <div className="space-y-3">
              {/* فیلد ورودی آیکون */}
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="مثال: 🔍 یا 📧 یا 🎵"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  maxLength={2}
                  className="flex-1"
                />
                {form.url && !form.icon && (
                  <Button
                    size="small"
                    type="dashed"
                    onClick={() => {
                      const suggestedIcon = getFaviconFromUrl(
                        form.url.startsWith("http")
                          ? form.url
                          : `https://${form.url}`
                      );
                      setForm((prev) => ({ ...prev, icon: suggestedIcon }));
                    }}
                    style={{
                      color: "var(--theme-secondary)",
                      borderColor: "var(--theme-secondary)",
                    }}
                  >
                    استفاده
                  </Button>
                )}
                <Button
                  size="small"
                  type="dashed"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  style={{
                    color: "var(--theme-text)",
                    borderColor: "var(--theme-text)",
                  }}
                >
                  انتخاب
                </Button>
              </div>

              {/* انتخابگر آیکون */}
              {showIconPicker && (
                <div
                  className="rounded-lg p-3 backdrop-blur-sm"
                  style={{
                    border: "1px solid var(--theme-border)",
                    backgroundColor: "rgba(0,0,0,0.2)",
                  }}
                >
                  {/* فیلتر دسته‌بندی */}
                  <div className="mb-3">
                    <Select
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      size="small"
                      style={{ width: "100%" }}
                      placeholder="انتخاب دسته‌بندی"
                    >
                      {Object.entries(iconCategories).map(([key, name]) => (
                        <Select.Option key={key} value={key}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  {/* گرید آیکون‌ها */}
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {Object.entries(siteIcons)
                      .filter(
                        ([, data]) =>
                          selectedCategory === "all" ||
                          data.category === selectedCategory
                      )
                      .map(([key, data]) => (
                        <div
                          key={key}
                          className="flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 group"
                          style={{
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor =
                              "var(--theme-background)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, icon: data.emoji }));
                            setShowIconPicker(false);
                          }}
                          title={data.name}
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                            {data.emoji}
                          </span>
                          <span
                            className="text-xs mt-1 text-center leading-tight"
                            style={{ color: "var(--theme-text)" }}
                          >
                            {data.name.length > 8
                              ? data.name.substring(0, 8) + "..."
                              : data.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <small className="text-gray-500">
              اگر خالی بگذارید، آیکون مناسب براساس سایت انتخاب می‌شود
            </small>
          </div>

          {/* دکمه‌های سفارشی */}
          <div className="flex gap-3 mt-6 pt-4">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setIsModalInsideFolder(false); // ریست کردن حالت مودال
                setShowIconPicker(false);
                setSelectedCategory("all");
              }}
              className="flex-1 h-10 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 font-medium rounded-lg transition-all duration-200 bg-transparent"
              style={{
                backgroundColor: "transparent",
                borderColor: "#ef4444",
                color: "#dc2626",
              }}
            >
              انصراف
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              className="flex-1 h-10 font-medium rounded-lg transition-all duration-200"
              style={{
                backgroundColor: "var(--theme-primary)",
                borderColor: "var(--theme-primary)",
              }}
            >
              {editingBookmark ? "ویرایش" : "افزودن"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* مودال افزودن فولدر */}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Modal: {
              colorPrimary: "#9810fa",
            },
          },
        }}
      >
        <Modal
          title={null}
          open={showFolderModal}
          onOk={null}
          onCancel={null}
          footer={null}
          closeIcon={null}
          centered
          maskStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
          styles={{
            body: { direction: "rtl" },
          }}
        >
          <div className="space-y-4" style={{ direction: "rtl" }}>
            {/* عنوان سفارشی */}
            <div className="text-center mb-6">
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--theme-secondary)" }}
              >
                {editingFolder ? "ویرایش فولدر" : "افزودن فولدر جدید"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                نام فولدر
              </label>
              <Input
                placeholder="مثال: کاری، شخصی، تفریحی"
                value={folderForm.title}
                onChange={(e) =>
                  setFolderForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                آیکون فولدر (اختیاری)
              </label>
              <Input
                placeholder="مثال: 📁 یا 💼 یا 🎮 (پیش‌فرض: 📁)"
                value={folderForm.icon}
                onChange={(e) =>
                  setFolderForm((prev) => ({ ...prev, icon: e.target.value }))
                }
                maxLength={2}
              />
              <small className="text-gray-500">
                اگر خالی بگذارید، آیکون 📁 استفاده می‌شود
              </small>
            </div>

            {/* دکمه‌های سفارشی */}
            <div className="flex gap-3 mt-6 pt-4">
              <Button
                onClick={() => {
                  setShowFolderModal(false);
                  setEditingFolder(null);
                  setFolderForm({ title: "", icon: "" });
                }}
                className="flex-1 h-10 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 font-medium rounded-lg transition-all duration-200 bg-transparent"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#ef4444",
                  color: "#dc2626",
                }}
              >
                انصراف
              </Button>
              <Button
                type="primary"
                onClick={createFolder}
                className="flex-1 h-10 font-medium rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  borderColor: "var(--theme-primary)",
                }}
              >
                {editingFolder ? "ویرایش" : "افزودن"}
              </Button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
});

export default BookmarkCards;
