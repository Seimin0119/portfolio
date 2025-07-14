import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export const updateUserProfile = async (
    userId: string,
    username: string,
    data: { bio?: string; avatar?: File }
) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");
    const formData = new FormData();
    if (username) formData.append("username", username);
    if (data.bio !== undefined) formData.append("bio", data.bio); // 允许空字符串
    if (data.avatar) formData.append("avatar", data.avatar);

    const res = await axios.put(`${API_BASE}/profile/${userId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getUserProfile = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");
    const res = await axios.get(`${API_BASE}/profile/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

