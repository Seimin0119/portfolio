// src/api/followApi.ts
import axios from "axios";
const API_BASE = "http://localhost:5000/api/auth";

export type FollowingUser = {
    _id: string;
    username: string;
    avatar: string;
    bio: string;
};

// 获取当前用户与目标用户之间的关注状态
export const getFollowStatus = async (targetUserId: string): Promise<{ status: "none" | "following" | "mutual" }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/follow/status/${targetUserId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data; // 应该返回：{ status: "none" | "following" | "mutual" }
};

// 切换关注状态（关注/取关）
export const toggleFollow = async (targetUserId: string): Promise<{ followed: boolean; status: "none" | "following" | "mutual" }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.post(`${API_BASE}/follow/${targetUserId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data; // 应该返回：{ followed: true/false, status: ... }
};

// 获取我关注的人列表
export const getMyFollowings = async (userId: string): Promise<FollowingUser[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录");

    const res = await axios.get(`${API_BASE}/following/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data; // 返回 id 数组
};

// 获取关注我的人列表
export const getMyFollowers = async (userId: string): Promise<string[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录");

    const res = await axios.get(`${API_BASE}/followers/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data; // 返回 id 数组
};
