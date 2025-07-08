// src/api/bookmarkApi.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

// 收藏或取消收藏（toggle）
export const toggleBookmarks = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.post(`${API_BASE}/bookmarks/${postId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data; // { liked: true/false, message: string }
};

// 获取某个帖子的点赞数
export const getBookmarksCounts = async (postId: string) => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/bookmarksCount/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.count;
};

// 获取用户收藏的所有帖子
export const getBookmarksByUser = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/bookmarksByUser/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.bookmarks;
};