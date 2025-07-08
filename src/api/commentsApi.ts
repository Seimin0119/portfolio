// src/api/commentsApi.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

// 评论帖子
export const addComment = async (postId: string, content: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.post(`${API_BASE}/addComment/${postId}`, {content}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// 获取某个帖子的点赞数
export const getCommentsCounts = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/commentsCount/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.count;
};

// 获取某帖的所有评论
export const getCommentsByPost = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/commentsByPost/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};