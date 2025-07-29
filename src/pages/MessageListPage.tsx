import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMyMessages } from "../api/messageApi";
import { getCurrentUser } from "../util/auth";
import { getUserProfile } from "../api/userApi";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Badge,
    Typography,
    Paper,
    Box,
    CircularProgress,
} from "@mui/material";

const getAvatarUrl = (avatarPath?: string) =>
    avatarPath
        ? avatarPath.startsWith("/")
            ? `http://localhost:5000${avatarPath}`
            : `http://localhost:5000/uploads/${avatarPath}`
        : "/default-avatar.png";

export const MessageListPage: React.FC = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [userMap, setUserMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    const userId = user?.id;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getAllMyMessages().then((messages) => {
            const tempMap: Record<string, any> = {};
            messages.forEach((msg: any) => {
                const otherId = msg.sender === userId ? msg.receiver : msg.sender;
                if (!tempMap[otherId]) {
                    tempMap[otherId] = { userId: otherId, unread: 0, lastMsg: msg };
                }
                if (msg.receiver === userId && !msg.read) {
                    tempMap[otherId].unread += 1;
                }
                if (
                    !tempMap[otherId].lastMsg ||
                    new Date(msg.createdAt) > new Date(tempMap[otherId].lastMsg.createdAt)
                ) {
                    tempMap[otherId].lastMsg = msg;
                }
            });
            setConversations(Object.values(tempMap));
            const userIds = Object.keys(tempMap);
            Promise.all(
                userIds.map((id) => getUserProfile(id).catch(() => null))
            ).then((users) => {
                const map: Record<string, any> = {};
                users.forEach((u, idx) => {
                    if (u) map[userIds[idx]] = u;
                });
                setUserMap(map);
                setLoading(false);
            });
        });
    }, [userId]);

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
            <Typography variant="h5" fontWeight="bold" mb={2} mt={5} align="center">
                消息
            </Typography>
            <Paper
                elevation={2}
                sx={{
                    width: "100%",
                    maxWidth: 600,
                    mx: "auto",
                    p: 0,
                }}
            >
                <List sx={{ width: "100%" }}>
                    {conversations.map((conv) => {
                        const otherUser = userMap[conv.userId];
                        return (
                            <ListItem
                                key={conv.userId}
                                button
                                onClick={() => navigate(`/messages/${conv.userId}`)}
                                alignItems="flex-start"
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: "1px solid #f0f0f0",
                                    px: 2,
                                    py: 2,
                                    "&:last-child": { borderBottom: "none" },
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                    "&:hover": { background: "#f0f4ff" },
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        color="error"
                                        variant="dot"
                                        invisible={conv.unread === 0}
                                        overlap="circular"
                                    >
                                        <Avatar src={getAvatarUrl(otherUser?.avatar)} sx={{ width: 48, height: 48 }} />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight="bold" fontSize={18}>
                                            {otherUser?.nickname || otherUser?.username || conv.userId}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                component="span" // 这里加上
                                                variant="body2"
                                                color="text.secondary"
                                                noWrap
                                                sx={{ display: "block", maxWidth: 320 }}
                                            >
                                                {conv.lastMsg.content}
                                            </Typography>
                                            <Typography
                                                component="span" // 这里加上
                                                variant="caption"
                                                color="text.disabled"
                                                sx={{ display: "block" }}
                                            >
                                                {new Date(conv.lastMsg.createdAt).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                    sx={{ ml: 2 }}
                                />
                                {conv.unread > 0 && (
                                    <Typography
                                        color="error"
                                        fontWeight="bold"
                                        sx={{
                                            minWidth: 24,
                                            textAlign: "center",
                                            ml: 1,
                                            fontSize: 14,
                                            background: "#ffeaea",
                                            borderRadius: "12px",
                                            px: 1,
                                        }}
                                    >
                                        {conv.unread}
                                    </Typography>
                                )}
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        </Box>
    );
};