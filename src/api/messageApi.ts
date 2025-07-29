import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

// 获取与某用户的历史消息
export const getMessages = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/message/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.messages;
};

// 发送消息
export const sendMessage = async (
    receiver: string,
    content: string,
) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.post(
        `${API_BASE}/message`,
        { receiver, content },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

// 获取所有与我相关的消息（用于统计未读数，需后端支持，见下方扩展）
export const getAllMyMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/all-messages`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.messages;
};