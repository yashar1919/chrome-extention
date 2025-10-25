import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { ConfigProvider, theme, Checkbox, Popconfirm, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

// تنظیمات theme را خارج از کامپوننت قرار می‌دهیم
const DARK_THEME_CONFIG = {
  algorithm: theme.darkAlgorithm,
  components: {
    Checkbox: {
      colorPrimary: "var(--theme-primary)",
    },
  },
};

const POPCONFIRM_THEME_CONFIG = {
  algorithm: theme.darkAlgorithm,
  components: {
    Popconfirm: {
      colorPrimary: "var(--theme-primary)",
    },
  },
};

const TodoList = memo(function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [newTodoId, setNewTodoId] = useState(null); // برای انیمیشن todo جدید
  const inputRef = useRef(null);

  // خواندن todoها از localStorage هنگام mount
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // ذخیره todoها در localStorage هر بار که تغییر کردند
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addOrUpdateTodo = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.trim()) return;
      if (editId) {
        setTodos((todos) =>
          todos.map((todo) =>
            todo.id === editId ? { ...todo, text: input } : todo
          )
        );
        setEditId(null);
      } else {
        const newId = Date.now();
        const newTodo = { text: input, done: false, id: newId };

        // اضافه کردن todo جدید
        setTodos((prev) => [newTodo, ...prev]);

        // ست کردن انیمیشن برای todo جدید
        setNewTodoId(newId);

        // حذف انیمیشن بعد از مدت کوتاه
        setTimeout(() => {
          setNewTodoId(null);
        }, 600);
      }
      setInput("");
      inputRef.current?.focus();
    },
    [input, editId]
  );

  const toggleTodo = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }, []);

  const removeTodo = useCallback(
    (id) => {
      setTodos((todos) => todos.filter((todo) => todo.id !== id));
      if (editId === id) {
        setEditId(null);
        setInput("");
      }
      message.success("آیتم با موفقیت حذف شد.");
    },
    [editId]
  );

  const editTodo = useCallback((todo) => {
    setInput(todo.text);
    setEditId(todo.id);
    inputRef.current?.focus();
  }, []);

  return (
    <>
      {/* CSS انیمیشن برای todo جدید */}
      <style>
        {`
          @keyframes slideInFromTop {
            0% {
              transform: translateY(-20px) scale(0.95);
              opacity: 0;
            }
            50% {
              transform: translateY(-5px) scale(1.02);
              opacity: 0.8;
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          
          .todo-animate-in {
            animation: slideInFromTop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}
      </style>

      <div className="flex flex-col glass-black w-[300px] rounded-2xl p-5 h-full min-h-0">
        <h2 className="text-xl font-bold text-gray-200">لیست کارها</h2>
        <div className="border-t border-white/40 mt-1 mb-4"></div>

        {/* لیست todoها - حالا بالای کامپوننت */}
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pl-2 mb-4">
          {todos.length === 0 && (
            <div className="text-center text-white/60 mt-8">
              کاری ثبت نشده است!
            </div>
          )}
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg bg-black/20 border transition group hover:bg-white/10 ${
                newTodoId === todo.id ? "todo-animate-in" : ""
              }`}
              style={{
                borderColor: "var(--theme-border)",
                ...(newTodoId === todo.id
                  ? {
                      animation:
                        "slideInFromTop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: "translateY(0)",
                      opacity: 1,
                    }
                  : {}),
              }}
            >
              <ConfigProvider theme={DARK_THEME_CONFIG}>
                <Checkbox
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
              </ConfigProvider>
              <span
                className={`flex-1 text-white cursor-pointer select-none transition mr-3 text-[16px] text-right ${
                  todo.done ? "line-through opacity-50" : ""
                }`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>
              <div className="flex justify-end items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700 transition cursor-pointer text-lg"
                  onClick={() => editTodo(todo)}
                >
                  <EditOutlined />
                </button>
                <ConfigProvider theme={POPCONFIRM_THEME_CONFIG}>
                  <Popconfirm
                    title="حذف آیتم"
                    description="آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={() => removeTodo(todo.id)}
                    okText="حذف"
                    cancelText="لغو"
                  >
                    <button className="text-red-500 hover:text-pink-700 transition cursor-pointer text-lg">
                      <DeleteOutlined />
                    </button>
                  </Popconfirm>
                </ConfigProvider>
              </div>
            </div>
          ))}
        </div>

        {/* فرم افزودن/ویرایش - حالا پایین کامپوننت */}
        <form onSubmit={addOrUpdateTodo} className="flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 rounded-lg px-3 py-2 bg-black/40 text-white border focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--theme-border)",
              focusRingColor: "var(--theme-primary)",
            }}
            placeholder="کار جدید..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--theme-primary)";
              e.target.style.boxShadow = `0 0 0 2px var(--theme-background)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--theme-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            className="text-white p-2 rounded-full cursor-pointer font-bold shadow hover:scale-105 transition"
            style={{
              background: "var(--theme-gradient-button)",
            }}
          >
            {editId ? (
              "آپدیت"
            ) : (
              <svg
                fill="#fff"
                width="20px"
                height="20px"
                viewBox="0 0 256 256"
                id="Flat"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </>
  );
});

export default TodoList;
