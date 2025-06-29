import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export const updateUserProfile = async (
    userId: string,
    data: { bio?: string; avatar?: File }
) => {
    const formData = new FormData();
    if (data.bio !== undefined) formData.append("bio", data.bio); // ✅ 允许空字符串
    if (data.avatar) formData.append("avatar", data.avatar);

    const res = await axios.put(`${API_BASE}/profile/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
    });

    return res.data;
};

export const getUserProfile = async (userId: string) => {
    const res = await axios.get(`${API_BASE}/profile/${userId}`, {
        withCredentials: true, // 如果需要
    });
    return res.data;
};

