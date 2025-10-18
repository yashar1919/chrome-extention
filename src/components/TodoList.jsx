import React, { useState, useRef, useEffect } from "react";
import { ConfigProvider, theme, Checkbox, Popconfirm, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
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

  const addOrUpdateTodo = (e) => {
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
      setTodos([{ text: input, done: false, id: Date.now() }, ...todos]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
    if (editId === id) {
      setEditId(null);
      setInput("");
    }
    message.success("آیتم با موفقیت حذف شد.");
  };

  const editTodo = (todo) => {
    setInput(todo.text);
    setEditId(todo.id);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col glass-black w-[300px] rounded-2xl p-5 h-full min-h-0">
      <h2 className="text-xl font-bold text-white mb-4">لیست کارها</h2>
      <form onSubmit={addOrUpdateTodo} className="flex mb-4 gap-2">
        <input
          ref={inputRef}
          className="flex-1 rounded-lg px-3 py-2 bg-black/30 text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="کار جدید..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-400 text-white p-2 rounded-full cursor-pointer font-bold shadow hover:scale-105 transition"
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
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pl-2">
        {todos.length === 0 && (
          <div className="text-center text-white/60 mt-8">
            کاری ثبت نشده است!
          </div>
        )}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg bg-black/20 border border-purple-300 transition group hover:bg-white/10`}
          >
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                components: {
                  Checkbox: {
                    colorPrimary: "#9810fa",
                  },
                },
              }}
            >
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
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  components: {
                    Popconfirm: {
                      colorPrimary: "#9810fa",
                    },
                  },
                }}
              >
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
    </div>
  );
}

export default TodoList;
