import React, { useEffect, useState } from "react";
import {
    Typography,
    Avatar,
    Box,
    IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { toggleLikes, getLikeCounts, getLikesByUser } from "../api/likeApi";
import { toggleBookmarks, getBookmarksCounts, getBookmarksByUser } from "../api/bookmarkApi";
import { addComment, getCommentsCounts, getCommentsByPost } from "../api/commentsApi";
import { getCurrentUser } from "../util/auth";
import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router-dom";       // 👈 新增
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";

interface DianzanProps {
    post: any;
}

export const PostActions: React.FC<DianzanProps> = ({ post }) => {
    const postId = post._id;
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [bookmarkedCounts, setBookmarkedCounts] = useState<Record<string, number>>({});
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
    // 评论抽屉控制
    const [openDrawerPostId, setOpenDrawerPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<Record<string, any[]>>({});
    const [newComment, setNewComment] = useState<string>("");
    const navigate = useNavigate();      // 👈 用于跳转

    useEffect(() => {
        const fetchMeta = async () => {
            const userId = getCurrentUser().id;
            const likeRes = await getLikeCounts(postId);
            const commentRes = await getCommentsCounts(postId);
            const bookmarkRes = await getBookmarksCounts(postId);

            const userLikes = await getLikesByUser(userId);
            const userBookmarks = await getBookmarksByUser(userId);

            setLikeCounts({ [postId]: likeRes });
            setLikedPosts({ [postId]: userLikes.some((l: any) => l.postId === postId) });

            setCommentCounts({ [postId]: commentRes });
            setBookmarkedCounts({ [postId]: bookmarkRes });
            setBookmarkedPosts({ [postId]: userBookmarks.some((b: any) => b.postId === postId) });
        };

        fetchMeta();
    }, [postId]);


    const handleLike = async (postId: string) => {
        try {
            const res = await toggleLikes(postId);

            const userId = getCurrentUser().id;
            const userLikes = await getLikesByUser(userId);
            setLikedPosts((prev) => ({
                ...prev,
                [postId]: userLikes.some((b: any) => b.postId === postId),
            }));

            setLikeCounts((prev) => ({
                ...prev,
                [postId]: res.liked ? (prev[postId] || 0) + 1 : (prev[postId] || 1) - 1,
            }));
        } catch (err) {
            console.error("点赞失败:", err);
        }
    };

    const handleBookmark = async (postId: string) => {
        try {
            const res = await toggleBookmarks(postId); // 调用 API

            const userId = getCurrentUser().id;
            const userBookmarked = await getBookmarksByUser(userId);

            setBookmarkedPosts((prev) => ({
                ...prev,
                [postId]: userBookmarked.some((b: any) => b.postId === postId),
            }));

            setBookmarkedCounts((prev) => ({
                ...prev,
                [postId]: res.liked ? (prev[postId] || 0) + 1 : (prev[postId] || 1) - 1,
            }));
        } catch (err) {
            console.error("点赞失败:", err);
        }
    };

    // 打开评论抽屉
    const handleOpenComments = async (postId: string) => {
        setOpenDrawerPostId(postId);
        try {
            const res = await getCommentsByPost(postId);
            console.log("📥 获取到的评论数据：", res.comments);
            setComments((prev) => ({ ...prev, [postId]: res || [] }));
        } catch (err) {
            console.error("获取评论失败", err);
        }
        console.log("comments111111", comments)
    };

    // 关闭评论抽屉
    const handleCloseComments = () => {
        setOpenDrawerPostId(null);
        setNewComment("");
    };

    // 发送评论
    const handleSubmitComment = async () => {
        if (!newComment.trim() || !openDrawerPostId) return;

        try {
            await addComment(openDrawerPostId, newComment);
            const res = await getCommentsByPost(openDrawerPostId); // 重新加载
            setComments((prev) => ({ ...prev, [openDrawerPostId]: res || [] }));
            setNewComment("");
        } catch (err) {
            console.error("发送评论失败", err);
        }
        console.log("comments22222", comments)
    };

    return (
        <>
            {/* 按钮区域（点赞/评论/收藏） */}
            <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={() => handleLike(postId)}>
                    {likedPosts[postId] ? (
                        <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: "gray" }} />
                    )}
                </IconButton>
                <Typography variant="body2">{likeCounts[postId] || 0}</Typography>

                <IconButton onClick={() => handleOpenComments(postId)}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography variant="body2">{commentCounts[postId] || 0}</Typography>

                <IconButton onClick={() => handleBookmark(postId)}>
                    {bookmarkedPosts[postId] ? (
                        <BookmarkIcon sx={{ color: "#1976d2" }} />
                    ) : (
                        <BookmarkBorderIcon sx={{ color: "gray" }} />
                    )}
                </IconButton>
                <Typography variant="body2">{bookmarkedCounts[postId] || 0}</Typography>
            </Box>

            {/* 评论抽屉 */}
            <Drawer
                anchor="bottom"
                open={!!openDrawerPostId}
                onClose={handleCloseComments}
                sx={{ zIndex: 1400 }}
            >
                <Box sx={{ p: 2, height: "60vh", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6">コメント</Typography>
                    <Divider sx={{ my: 1 }} />

                    {/* 评论内容 */}
                    <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
                        {(comments[openDrawerPostId || ""] || []).map((comment, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                                {/* 用户信息区 */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar
                                        src={
                                            comment.userId?.avatar
                                                ? `http://localhost:5000${comment.userId.avatar}`
                                                : "/default-avatar.png"
                                        }
                                        sx={{ width: 36, height: 36, cursor: "pointer" }}
                                        onClick={() => navigate(`/profile/${comment.userId?._id}`)}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: "bold", cursor: "pointer" }}
                                        onClick={() => navigate(`/profile/${comment.userId?._id}`)}
                                    >
                                        {comment.userId?.username || "匿名"}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* 评论内容 */}
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 0.5, ml: 6, fontWeight: 500, color: "#111" }}
                                >
                                    {comment.content}
                                </Typography>

                                <Divider sx={{ my: 1 }} />
                            </Box>
                        ))}
                    </Box>

                    {/* 输入框 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            fullWidth
                            placeholder="コメントを入力..."
                            size="small"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <IconButton onClick={handleSubmitComment}>
                            <SendIcon color="primary" />
                        </IconButton>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};
