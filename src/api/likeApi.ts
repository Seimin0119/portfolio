// src/api/likeApi.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

// 点赞或取消点赞（toggle）
export const toggleLikes = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("未登录，缺少 token");

  const res = await axios.post(`${API_BASE}/likes/${postId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 获取某个帖子的点赞数
export const getLikeCounts = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("未登录，缺少 token");

  const res = await axios.get(`${API_BASE}/likesCount/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.count;
};

// 获取用户点赞的所有帖子
export const getLikesByUser = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("未登录，缺少 token");

  const res = await axios.get(`${API_BASE}/likesByUser/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.likes;
};

// 获取某用户所有帖子的点赞数与收藏数
export const getUserStats = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("未登录");

  const res = await axios.get(`${API_BASE}/userStats/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { likes: 123, bookmarks: 456, total: 579 }
};