import React, { useEffect } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    CardHeader,
    Box
} from "@mui/material";
import { getMyFollowings } from "../api/followApi";
import { getUserProfile } from "../api/userApi";
import { getPostsByUser } from "../api/postApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { PostActions } from "../components/PostActions";
import { FollowButton } from "../components/FollowButton";
import { getCurrentUser } from "../util/auth";
import type { FollowingUser } from "../api/followApi";

export const FollowFeedPage: React.FC = () => {
    const { posts, setPosts, userProfiles, setUserProfiles } = useUser();
    const navigate = useNavigate();
    const currentUserId = getCurrentUser().id;

    useEffect(() => {
        const fetchFollowData = async () => {
            try {
                if (!currentUserId) return;

                const followings = await getMyFollowings(currentUserId) as FollowingUser[];
                console.log("followings", followings);
                const allPosts: any[] = [];

                const myPosts = await getPostsByUser(currentUserId);
                allPosts.push(...myPosts);

                for (const user of followings) {
                    const userPosts = await getPostsByUser(user._id);
                    allPosts.push(...userPosts);
                }
                console.log("allPosts", allPosts)

                allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(allPosts);

                const uniqueUserIds = [...new Set(allPosts.map((p) => p.userId))];

                const profileEntries = await Promise.all(
                    uniqueUserIds.map(async (id) => {
                        try {
                            const profile = await getUserProfile(id);
                            return [id, {
                                username: profile.username,
                                avatar: "http://localhost:5000" + profile.avatar
                            }];

                        } catch {
                            return [id, {
                                username: "未知用户",
                                avatar: "/default-avatar.png"
                            }];
                        }
                    })
                );

                setUserProfiles(Object.fromEntries(profileEntries));
                console.log("profile", userProfiles)
            } catch (err) {
                console.error("获取关注数据失败", err);
            }
        };

        fetchFollowData();
    }, []);

    return (
        <>
            <Box
                sx={{
                    width: "100vw",
                    minHeight: "93vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#f9f9f9",
                    py: 4,
                }}
            >
                <Container maxWidth="sm">
                    <Grid container spacing={4} mt={2}>
                        {posts.map((post) => {
                            const { _id, content, createdAt, userId, imageUrls, tags } = post;
                            const author = userProfiles[userId];

                            return (
                                <Grid item xs={12} key={_id}>
                                    <Card>
                                        <CardHeader
                                            avatar={
                                                <Avatar
                                                    src={author?.avatar || "/default-avatar.png"}
                                                    onClick={() => navigate(`/profile/${post.userId}`)}
                                                    sx={{ cursor: "pointer" }}
                                                />
                                            }
                                            title={
                                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                                    <Typography
                                                        variant="subtitle1"
                                                        onClick={() => navigate(`/profile/${post.userId}`)}
                                                        sx={{ cursor: "pointer" }}
                                                    >
                                                        {author?.username || "未知用户"}
                                                    </Typography>

                                                    {/* 👇 关注按钮：自己不显示 */}
                                                    {post.userId !== currentUserId && (
                                                        <FollowButton targetUserId={post.userId} />
                                                    )}
                                                </Box>
                                            }
                                            subheader={new Date(createdAt).toLocaleDateString()}
                                        />

                                        <Box sx={{ cursor: "pointer" }} onClick={() => navigate(`/post/${post._id}`)}>
                                            {/* 图片轮播，如果有图片才显示 */}
                                            {imageUrls && imageUrls.length > 0 && (
                                                <Swiper
                                                    modules={[Pagination]}
                                                    spaceBetween={0}
                                                    slidesPerView={1}
                                                    pagination={{ clickable: true }}
                                                    style={{ width: "100%", height: 300 }}
                                                >
                                                    {imageUrls.map((img, idx) => (
                                                        <SwiperSlide key={idx}>
                                                            <Box
                                                                component="img"
                                                                src={`http://localhost:5000${img}`}
                                                                alt={`post-img-${idx}`}
                                                                sx={{
                                                                    width: "100%",
                                                                    height: 300,
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            )}
                                        </Box>
                                        <PostActions post={post} />
                                        <CardContent>
                                            <Typography variant="body1">{content}</Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {tags?.map((tag) => `#${tag}`).join(', ')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};
