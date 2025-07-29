import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../api/messageApi";
import { getCurrentUser } from "../util/auth";
import {
    Box,
    Avatar,
    TextField,
    Button,
    Paper,
    Typography,
    CircularProgress,
} from "@mui/material";

// 假设有一个API可以通过userId获取用户信息
import { getUserProfile } from "../api/userApi"; // 你需要实现这个API

const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return "/default-avatar.png";
    // 如果没有斜杠，自动补全
    return avatarPath.startsWith("/")
        ? `http://localhost:5000${avatarPath}`
        : `http://localhost:5000/uploads/${avatarPath}`;
};

export const MessageDetailPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const user = getCurrentUser();
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [otherUser, setOtherUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        Promise.all([
            getMessages(userId),
            getUserProfile(userId)
        ]).then(([msgs, other]) => {
            setMessages(msgs);
            setOtherUser(other);
            setLoading(false);
        });
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!content.trim()) return;
        await sendMessage(userId!, content);
        setContent("");
        // 重新拉取消息
        getMessages(userId!).then(setMessages);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "#f5f6fa",
                py: 4,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 900, // 你可以改成1000、1200等
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} mt={5} align="center">
                    与 {otherUser?.nickname || otherUser?.username || userId} 的私信
                </Typography>
                <Paper
                    elevation={2}
                    sx={{
                        width: "88%", // 拉满
                        flex: 1,
                        overflowY: "auto",
                        padding: 2,
                        mb: 2,
                        background: "#f9f9f9",
                    }}
                >
                    {messages.map((msg) => {
                        const isMe = msg.sender === user.id;
                        const avatar = isMe ? user.avatar : otherUser?.avatar;
                        const nickname = isMe ? user.username : (otherUser?.nickname || otherUser?.username);
                        return (
                            <Box
                                key={msg._id}
                                display="flex"
                                flexDirection={isMe ? "row-reverse" : "row"}
                                alignItems="flex-end"
                                mb={2}
                            >
                                <Avatar src={getAvatarUrl(avatar)} sx={{ width: 40, height: 40, mx: 1 }} />
                                <Box
                                    sx={{
                                        maxWidth: "70%",
                                        bgcolor: isMe ? "#aee" : "#fff",
                                        borderRadius: 2,
                                        p: 1.5,
                                        boxShadow: 1,
                                        ml: isMe ? 0 : 1,
                                        mr: isMe ? 1 : 0,
                                    }}
                                >
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {nickname}
                                    </Typography>
                                    <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                        {msg.content}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled" display="block" align={isMe ? "right" : "left"}>
                                        {new Date(msg.createdAt).toLocaleString()}
                                        {msg.sender !== user.id && !msg.read && (
                                            <span style={{ color: "red", marginLeft: 4 }}>●未读</span>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </Paper>
                <Box display="flex" alignItems="center" gap={1} width="88%" mt={1} mb={5}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="输入消息内容"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />
                    <Button variant="contained" onClick={handleSend}>
                        发送
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};