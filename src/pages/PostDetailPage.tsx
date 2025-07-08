// src/pages/PostDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Container,
    Typography,
    Grid,
    Divider,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { getPostById, getPostsByUser, deletePostById } from "../api/postApi";
import { useUser } from "../contexts/UserContext";
import { getCurrentUser } from "../util/auth";
import { PostActions } from "../components/PostActions";

export const PostDetailPage: React.FC = () => {
    const { postId } = useParams();
    const navigate = useNavigate();      // 👈 用于跳转
    const { userProfiles, userPosts, setUserPosts, post, setPost } = useUser();
    const [openDrawer, setOpenDrawer] = useState(false);
    const user = getCurrentUser();
    const userId = user?.id;

    console.log("postId", postId)
    useEffect(() => {
        const fetchData = async () => {
            if (!postId) return;
            const postData = await getPostById(postId);
            setPost(postData);

            // 获取该用户发布的所有帖子
            const userPostList = await getPostsByUser(postData.userId);
            setUserPosts(userPostList);
        };

        fetchData();
    }, [postId]);

    if (!post) return <div>加载中...</div>;

    const author = userProfiles[post.userId];
    const isAuthor = userId === post.userId;

    return (
        <Container maxWidth="md" sx={{ pt: 4 }}>
            {/* 顶部详情 */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} mt={5}>
                <Box display="flex" alignItems="center">
                    <Avatar src={author?.avatar || "/default-avatar.png"} />
                    <Typography variant="h6" ml={2}>
                        {author?.username || "未知用户"}
                    </Typography>
                </Box>

                {/* 三个点按钮，仅作者显示 */}
                {isAuthor && (
                    <>
                        <IconButton onClick={() => setOpenDrawer(true)}>
                            <MoreVertIcon />
                        </IconButton>

                        {/* 抽屉式底部弹出框 */}
                        <Drawer
                            anchor="bottom"
                            open={openDrawer}
                            onClose={() => setOpenDrawer(false)}
                        >
                            <List>
                                <ListItem button onClick={() => {
                                    setOpenDrawer(false);
                                    navigate(`/edit/${post._id}`); // 👈 跳转到编辑页面
                                }}>
                                    <ListItemText primary="编辑帖子" />
                                </ListItem>
                                <Divider />
                                <ListItem onClick={async () => {
                                    setOpenDrawer(false);
                                    if (window.confirm("确定要删除这条帖子吗？")) {
                                        try {
                                            await deletePostById(post._id);
                                            alert("帖子已删除");
                                            navigate("/"); // 跳转回首页或其他页面
                                        } catch (err: any) {
                                            alert("删除失败：" + err.message);
                                        }
                                    }
                                }}>
                                    <ListItemText primary="删除帖子" />
                                </ListItem>
                            </List>
                        </Drawer>
                    </>
                )}
            </Box>
            <Box sx={{ maxWidth: 400, mx: "auto" }}>
                {/* 图片轮播，如果有图片才显示 */}
                {post.imageUrls && post.imageUrls.length > 0 && (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        style={{ width: "100%", height: 400 }}
                    >
                        {post.imageUrls.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <Box
                                    component="img"
                                    src={`http://localhost:5000${img}`}
                                    alt={`post-img-${idx}`}
                                    sx={{
                                        width: "100%",
                                        height: 400,
                                        objectFit: "cover",
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </Box>
            <PostActions post={post} />
            <Typography variant="body1" mt={2}>
                {post.content}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
                {post.tags?.map((tag) => `#${tag}`).join(" ")}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* 用户其他帖子 */}
            <Typography variant="h6" mb={2}>
                @{author?.username} 的其它帖子
            </Typography>
            <Grid container spacing={2}>
                {userPosts.map((p) => (
                    <Grid item xs={6} sm={4} key={p._id}>
                        {p.imageUrls && p.imageUrls.length > 0 ? (
                            <Box
                                onClick={() => navigate(`/post/${p._id}`)}
                                component="img"
                                src={`http://localhost:5000${p.imageUrls[0]}`}
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                }}
                            />
                        ) : (
                            <Box
                                onClick={() => navigate(`/post/${p._id}`)}
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    borderRadius: 2,
                                    bgcolor: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 14,
                                    color: "#999",
                                    cursor: "pointer",
                                }}
                            >
                                仅文字内容
                            </Box>
                        )}
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
};
