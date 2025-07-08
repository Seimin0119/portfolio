import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export interface Post {
    _id: string;
    content: string;
    imageUrls?: string[];
    isPublic: boolean;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
}

interface UpdatePostData {
    content?: string;
    imageUrls?: string[],
    isPublic?: boolean;
    tags?: string[];
}

// ✅ 修改后的 createPosts 方法，支持上传内容 + 图片
export const createPosts = async (
    content: string,
    imageUrls: File[],
    isPublic: boolean,
    tags: string[]
): Promise<Post> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const formData = new FormData();
    formData.append("content", content);
    formData.append("isPublic", JSON.stringify(isPublic));
    formData.append("tags", JSON.stringify(tags));

    imageUrls.forEach((file) => {
        formData.append("images", file); // ✅ 确保字段名是后端接收的 images
    });
    const res = await axios.post(`${API_BASE}/posts`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getPosts = async (): Promise<Post[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getPostById = async (postId: string): Promise<Post> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.get(`${API_BASE}/users/${userId}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const deletePostById = async (postId: string): Promise<Post> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.delete(`${API_BASE}/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const updatePost = async (postId: string, updateData: UpdatePostData): Promise<Post> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录，缺少 token");

    const res = await axios.put(`${API_BASE}/posts/${postId}`, updateData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
