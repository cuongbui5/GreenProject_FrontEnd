// localStorageUtils.ts

/**
 * Lưu đối tượng vào localStorage.
 * @param key - Khóa để lưu dữ liệu.
 * @param value - Giá trị đối tượng cần lưu.
 */
export function setLocalStorage<T>(key: string, value: T): void {
    try {
        const jsonString = JSON.stringify(value);
        localStorage.setItem(key, jsonString);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

/**
 * Đọc đối tượng từ localStorage.
 * @param key - Khóa để lấy dữ liệu.
 * @returns - Đối tượng đã được phân tích, hoặc null nếu không có dữ liệu.
 */
export function getLocalStorage<T>(key: string): T | null {
    try {
        const jsonString = localStorage.getItem(key);
        if (jsonString) {
            return JSON.parse(jsonString) as T;
        }
        return null;
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
}

/**
 * Xóa đối tượng khỏi localStorage.
 * @param key - Khóa của đối tượng cần xóa.
 */
export function removeLocalStorage(key: string): void {
    try {
        if(localStorage.getItem(key)==undefined) return;
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
}
