import React, { useState, useEffect, useRef } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Modal, Input, Button, message, Popconfirm } from "antd";
import VanillaTilt from "vanilla-tilt";

const BookmarkCards = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: "گوگل", url: "https://google.com", icon: "🔍" },
          { id: 2, title: "GitHub", url: "https://github.com", icon: "👨‍💻" },
          { id: 3, title: "یوتیوب", url: "https://youtube.com", icon: "📺" },
          /* { id: 4, title: "فیسبوک", url: "https://facebook.com", icon: "📘" },
          { id: 5, title: "توییتر", url: "https://twitter.com", icon: "🐦" },
          {
            id: 6,
            title: "اینستاگرام",
            url: "https://instagram.com",
            icon: "📷",
          },
          { id: 7, title: "لینکدین", url: "https://linkedin.com", icon: "�" },
          { id: 8, title: "ردیت", url: "https://reddit.com", icon: "🔴" },
          { id: 9, title: "اسپاتیفای", url: "https://spotify.com", icon: "🎵" },
          { id: 10, title: "نتفلیکس", url: "https://netflix.com", icon: "🎬" },
          { id: 11, title: "آمازون", url: "https://amazon.com", icon: "📦" },
          { id: 12, title: "علی‌بابا", url: "https://alibaba.com", icon: "🛒" },
          { id: 13, title: "ایبی", url: "https://ebay.com", icon: "🏪" },
          { id: 14, title: "پی‌پال", url: "https://paypal.com", icon: "💰" },
          { id: 15, title: "اوبر", url: "https://uber.com", icon: "🚗" },
          { id: 16, title: "ایرباناب", url: "https://airbnb.com", icon: "🏠" },
          { id: 17, title: "بوکینگ", url: "https://booking.com", icon: "✈️" },
          {
            id: 18,
            title: "تریپ ادوایزر",
            url: "https://tripadvisor.com",
            icon: "🌍",
          },
          { id: 19, title: "زوم", url: "https://zoom.us", icon: "�" },
          { id: 20, title: "اسکایپ", url: "https://skype.com", icon: "☎️" },
          { id: 21, title: "تلگرام", url: "https://telegram.org", icon: "✈️" },
          { id: 22, title: "واتساپ", url: "https://whatsapp.com", icon: "💬" },
          { id: 23, title: "دیسکورد", url: "https://discord.com", icon: "🎮" },
          { id: 24, title: "اسلک", url: "https://slack.com", icon: "📊" },
          { id: 25, title: "ترلو", url: "https://trello.com", icon: "📋" },
          { id: 26, title: "نوشن", url: "https://notion.so", icon: "📝" },
          { id: 27, title: "ایورنوت", url: "https://evernote.com", icon: "🗒️" },
          {
            id: 28,
            title: "گوگل درایو",
            url: "https://drive.google.com",
            icon: "☁️",
          },
          {
            id: 29,
            title: "دراپ‌باکس",
            url: "https://dropbox.com",
            icon: "📁",
          },
          {
            id: 30,
            title: "وان‌درایو",
            url: "https://onedrive.com",
            icon: "💾",
          },
          { id: 31, title: "ادوبی", url: "https://adobe.com", icon: "🎨" },
          { id: 32, title: "کنوا", url: "https://canva.com", icon: "🖌️" },
          { id: 33, title: "فیگما", url: "https://figma.com", icon: "📐" },
          { id: 34, title: "بیهنس", url: "https://behance.net", icon: "🎭" },
          { id: 35, title: "دریبل", url: "https://dribbble.com", icon: "🏀" },
          { id: 36, title: "میدیوم", url: "https://medium.com", icon: "📖" },
          { id: 37, title: "کورسرا", url: "https://coursera.org", icon: "🎓" },
          {
            id: 38,
            title: "خان آکادمی",
            url: "https://khanacademy.org",
            icon: "📚",
          },
          { id: 39, title: "یودمی", url: "https://udemy.com", icon: "🧑‍🏫" },
          {
            id: 40,
            title: "ویکی‌پدیا",
            url: "https://wikipedia.org",
            icon: "📜",
          },
          {
            id: 41,
            title: "استک اورفلو",
            url: "https://stackoverflow.com",
            icon: "�",
          },
          {
            id: 42,
            title: "ورد پرس",
            url: "https://wordpress.com",
            icon: "🌐",
          },
          { id: 43, title: "شاپیفای", url: "https://shopify.com", icon: "🛍️" },
          {
            id: 44,
            title: "میل‌چیمپ",
            url: "https://mailchimp.com",
            icon: "📧",
          },
          {
            id: 45,
            title: "هاب‌اسپات",
            url: "https://hubspot.com",
            icon: "📈",
          },
          {
            id: 46,
            title: "سیلزفورس",
            url: "https://salesforce.com",
            icon: "💼",
          },
          { id: 47, title: "آساناه", url: "https://asana.com", icon: "✅" },
          {
            id: 48,
            title: "مایکروسافت",
            url: "https://microsoft.com",
            icon: "🪟",
          },
          { id: 49, title: "اپل", url: "https://apple.com", icon: "🍎" },
          { id: 50, title: "تسلا", url: "https://tesla.com", icon: "⚡" }, */
        ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    icon: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  // با CSS Grid دیگه نیازی به positioning پیچیده نیست

  // ذخیره در localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // افکت Tilt برای کارت‌ها
  const cardRefs = useRef([]);
  useEffect(() => {
    const currentRefs = cardRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) {
        VanillaTilt.init(ref, {
          max: 15,
          speed: 400,
          glare: true,
          "max-glare": 0.2,
          scale: 1.02,
        });
      }
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref && ref.vanillaTilt) {
          ref.vanillaTilt.destroy();
        }
      });
    };
  }, [bookmarks]);

  const handleOpenModal = (bookmark = null) => {
    if (bookmark) {
      setEditingBookmark(bookmark);
      setForm({
        title: bookmark.title,
        url: bookmark.url,
        icon: bookmark.icon,
      });
    } else {
      setEditingBookmark(null);
      setForm({
        title: "",
        url: "",
        icon: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.url.trim()) {
      messageApi.error("لطفاً عنوان و آدرس را وارد کنید");
      return;
    }

    // بررسی محدودیت تعداد بوکمارک
    if (!editingBookmark && bookmarks.length >= 50) {
      messageApi.error("حداکثر 50 بوکمارک می‌توانید داشته باشید");
      return;
    }

    // بررسی فرمت URL
    let url = form.url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    if (editingBookmark) {
      // ویرایش
      setBookmarks((prev) =>
        prev.map((bookmark) =>
          bookmark.id === editingBookmark.id
            ? { ...bookmark, ...form, url }
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
        icon: form.icon || "🌐",
      };
      setBookmarks((prev) => [...prev, newBookmark]);
      messageApi.success("بوکمارک جدید اضافه شد");
    }

    setIsModalOpen(false);
    setForm({ title: "", url: "", icon: "" });
  };

  const handleDelete = (id) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    messageApi.success("بوکمارک حذف شد");
  };

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  const getIconElement = (icon) => {
    if (!icon) return <GlobalOutlined className="text-2xl text-purple-300" />;

    // اگر ایموجی است
    if (
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        icon
      )
    ) {
      return <span className="text-2xl">{icon}</span>;
    }

    // در غیر این صورت آیکون پیش‌فرض
    return <GlobalOutlined className="text-2xl text-purple-300" />;
  };

  return (
    <>
      {contextHolder}
      {/* کانتینر ساده برای کارت‌های بوکمارک */}
      <div
        className="h-full overflow-y-auto custom-scrollbar p-2"
        style={{
          maxHeight: "calc(100vh - 80px)", // فضای کافی برای سایر کامپوننت‌ها
          //border: "1px solid rgba(168, 85, 247, 0.5)", // border موقت برای تست
          borderRadius: "12px",
          //backgroundColor: "rgba(0, 0, 0, 0.1)", // پس‌زمینه موقت
        }}
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, 140px)",
            justifyContent: "center", // وسط‌چین کردن کارت‌ها
          }}
        >
          {/* کارت‌های بوکمارک */}
          {bookmarks.map((bookmark, index) => (
            <div
              key={bookmark.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="glass-black rounded-xl p-4 text-white cursor-pointer group hover:border-purple-400/50 transition-all duration-300 relative bookmark-card"
              style={{
                width: "140px",
                height: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
              onClick={() => handleCardClick(bookmark.url)}
            >
              {/* آیکون */}
              <div className="mb-2 bookmark-icon">
                {getIconElement(bookmark.icon)}
              </div>

              {/* عنوان */}
              <h3 className="text-sm font-bold text-purple-200 mb-1 line-clamp-1">
                {bookmark.title}
              </h3>

              {/* دکمه‌های ویرایش و حذف */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined style={{ fontSize: "12px" }} />}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 w-6 h-6 p-0 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(bookmark);
                  }}
                />
                <Popconfirm
                  title="حذف بوکمارک"
                  description="آیا از حذف این بوکمارک اطمینان دارید؟"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDelete(bookmark.id);
                  }}
                  okText="بله"
                  cancelText="خیر"
                  okButtonProps={{
                    style: {
                      backgroundColor: "#dc2626",
                      borderColor: "#dc2626",
                    },
                  }}
                >
                  <Button
                    size="small"
                    type="text"
                    icon={<DeleteOutlined style={{ fontSize: "12px" }} />}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/20 w-6 h-6 p-0 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}

          {/* کارت افزودن بوکمارک جدید */}
          <div
            className="glass-black rounded-xl p-4 text-white cursor-pointer border-dashed border-purple-400/50 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300 group"
            style={{
              width: "140px",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
            onClick={() => handleOpenModal()}
          >
            <PlusOutlined className="text-2xl text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <p className="text-purple-300 font-medium text-xs">
              افزودن بوکمارک
            </p>
          </div>
        </div>
      </div>

      {/* مودال افزودن/ویرایش */}
      <Modal
        title={editingBookmark ? "ویرایش بوکمارک" : "افزودن بوکمارک جدید"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editingBookmark ? "ویرایش" : "افزودن"}
        cancelText="انصراف"
        centered
        styles={{
          body: { direction: "rtl" },
        }}
      >
        <div className="space-y-4" style={{ direction: "rtl" }}>
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

          <div>
            <label className="block text-sm font-medium mb-1">
              آیکون (ایموجی)
            </label>
            <Input
              placeholder="مثال: 🔍 یا 📧 یا 🎵"
              value={form.icon}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, icon: e.target.value }))
              }
              maxLength={2}
            />
            <small className="text-gray-500">
              می‌توانید از ایموجی‌ها استفاده کنید
            </small>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookmarkCards;
