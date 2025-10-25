import { useState, useCallback } from 'react';

// Custom hook برای مدیریت localStorage با بهینه‌سازی
const useLocalStorage = (key, initialValue) => {
    // State برای ذخیره مقدار
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // تابع setter بهینه‌سازی شده با useCallback
    const setValue = useCallback((value) => {
        try {
            // اگر value یک function است، آن را اجرا کن
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            // ذخیره در localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // حذف آیتم از localStorage
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

export default useLocalStorage;