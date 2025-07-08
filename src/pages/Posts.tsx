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
import { getPosts } from "../api/postApi";
import { getUserProfile } from "../api/userApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";       // 👈 新增
import { PostActions } from "../components/PostActions";

export const Posts: React.FC = () => {
  const { posts, setPosts, userProfiles, setUserProfiles } = useUser();
  const navigate = useNavigate();      // 👈 用于跳转

  useEffect(() => {
    // 1. 获取帖子
    const fetchPostsWithAuthors = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);

        // 2. 提取所有 userId 并去重
        const uniqueUserIds = [...new Set(postsData.map((p) => p.userId))];

        // 3. 批量获取作者信息
        const profileEntries = await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const profile = await getUserProfile(id);
              return [id, { username: profile.username, avatar: "http://localhost:5000" + profile.avatar }];
            } catch {
              return [id, { username: "未知用户", avatar: "/default-avatar.png" }];
            }
          })
        );

        // 4. 保存映射关系
        setUserProfiles(Object.fromEntries(profileEntries));
      } catch (err) {
        console.error("获取帖子或作者信息失败", err);
      }
    };

    fetchPostsWithAuthors();
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
                        <Typography
                          variant="subtitle1"
                          onClick={() => navigate(`/profile/${post.userId}`)}
                          sx={{ cursor: "pointer" }}
                        >
                          {author?.username || "未知用户"}
                        </Typography>
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
