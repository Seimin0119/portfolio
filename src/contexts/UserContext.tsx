// src/contexts/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../api/userApi";

interface User {
    id: string;
    avatar?: string;
    bio?: string;
    [key: string]: any;
}

interface Post {
    _id: string;
    content: string;
    imageUrls?: string[];
    isPublic: boolean;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
}

interface UserProfile {
    username: string;
    avatar: string;
}

interface UserContextType {
    user: User | null;
    avatarUrl: string;
    login: (userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    // 帖子信息
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    // 用户个人主页信息
    userProfiles: Record<string, UserProfile>;
    setUserProfiles: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>;
    // 特定帖子信息
    post: Post | null;
    setPost: React.Dispatch<React.SetStateAction<Post | null>>;
    // 特定用户的帖子信息
    userPosts: Post[];
    setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
    const [posts, setPosts] = useState<Post[]>([]);
    const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
    const [userPosts, setUserPosts] = useState<Post[]>([]);
     const [post, setPost] = useState<Post | null>(null);

    // 初始化：尝试从 localStorage 读取用户数据
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
        }
    }, []);

    // 登录时调用：写入 localStorage 并设置 user 状态
    const login = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // 登出时调用
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setAvatarUrl("/default-avatar.png");
    };

    // 手动刷新用户头像信息（例如修改头像后调用）
    const refreshUser = async () => {
        if (!user?.id) return;
        try {
            const data = await getUserProfile(user.id);
            if (data) {
                setUser(data);
                if (data.avatar) {
                    setAvatarUrl("http://localhost:5000" + data.avatar);
                }
            }
        } catch (err) {
            console.error("❌ 用户刷新失败", err);
        }
    };

    useEffect(() => {
        if (user?.id) {
            refreshUser(); // 初始化头像
        }
    }, [user?.id]);

    return (
        <UserContext.Provider value={{ user, avatarUrl, login, logout, refreshUser, posts, setPosts, userProfiles, setUserProfiles, userPosts, setUserPosts, post, setPost }}>
            {children}
        </UserContext.Provider>
    );
};

// 👇 外部使用 hook 简化调用
export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser 必须在 UserProvider 内使用");
    return ctx;
};
