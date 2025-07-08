import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export const uploadImages = async (formData: FormData): Promise<{ imageUrls: string[] }> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};