import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Card,
  Avatar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { EditableAvatar } from "../components/EditableAvatar";
import { EditableText } from "../components/EditableText";
import { EditableUsername } from "../components/EditableUsername";
import { updateUserProfile, getUserProfile } from "../api/userApi";
import { getCurrentUser } from "../util/auth";
import { useUser } from "../contexts/UserContext";
import LogoutIcon from "@mui/icons-material/Logout"; // 👈 新增
import { useNavigate } from "react-router-dom";       // 👈 新增
import { getPostsByUser } from "../api/postApi";
import { useParams } from "react-router-dom";
import { getUserStats } from "../api/likeApi";
import { getMyFollowings, getMyFollowers } from "../api/followApi";

export const Profile: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { logout, posts, setPosts, userProfiles, setUserProfiles } = useUser();
  const currentUser = getCurrentUser();
  console.log("currentUser", currentUser)
  const navigate = useNavigate();      // 👈 用于跳转
  const { id: routeUserId } = useParams(); // 👈 routeUserId 就是从 /profile/:id 中来的
  const isAuthor = routeUserId === currentUser.id;
  const [userStats, setUserStats] = useState({ likes: 0, bookmarks: 0, total: 0 });
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        if (!routeUserId) return; // 没有 userId 参数就不执行
        const followings = await getMyFollowings(routeUserId);
        const followers = await getMyFollowers(routeUserId);
        setFollowingCount(followings.length);
        setFollowersCount(followers.length);
      } catch (err) {
        console.error("获取关注数据失败", err);
      }
    };

    fetchFollowData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!routeUserId) return; // 没有 userId 参数就不执行
        const stats = await getUserStats(routeUserId);
        setUserStats(stats);
      } catch (err) {
        console.error("获取统计信息失败", err);
      }
    };

    fetchStats();
  }, [routeUserId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!routeUserId) return; // 没有 userId 参数就不执行
      try {
        const data = await getUserProfile(routeUserId);
        if (data.avatar) setAvatarUrl("http://localhost:5000" + data.avatar);
        if (data.bio !== undefined) setBio(data.bio);
        if (data.username) setUsername(data.username);
      } catch (err) {
        console.error("❌ 获取用户信息失败:", err);
      }
    };

    fetchProfile();
  }, [routeUserId]);

  useEffect(() => {
    // 1. 获取帖子
    const fetchPostsWithAuthors = async () => {
      try {
        if (!routeUserId) return; // 没有 userId 参数就不执行
        const postsData = await getPostsByUser(routeUserId);
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
  }, [routeUserId]);

  const handleAvatarChange = async (file: File) => {
    try {
      if (!routeUserId) return; // 没有 userId 参数就不执行
      setAvatarUrl(URL.createObjectURL(file));
      await updateUserProfile(routeUserId, username, { avatar: file });
      setSnackbar({ open: true, message: "头像上传成功", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "头像上传失败", severity: "error" });
    }
  };

  const handleUsernameSave = async (newText: string) => {
    try {
      if (!routeUserId) return; // 没有 userId 参数就不执行
      setUsername(newText);
      await updateUserProfile(routeUserId, newText, { bio, avatar: undefined });
      setSnackbar({ open: true, message: "昵称更新成功", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "昵称更新失败", severity: "error" });
    }
  };

  const handleBioSave = async (newText: string) => {
    try {
      if (!routeUserId) return; // 没有 userId 参数就不执行
      setBio(newText);
      await updateUserProfile(routeUserId, username, { bio: newText });
      setSnackbar({ open: true, message: "简介更新成功", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "简介更新失败", severity: "error" });
    }
  };

  const handleSaveAll = () => {
    handleUsernameSave(username);
    handleBioSave(bio);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();                 // 👈 通知 context 清除状态
    navigate("/register");    // 👈 跳转到登录页
  };


  return (
    <>
      <Box
        mt={8}
        sx={{
          width: "100vw",
          bgcolor: "#f9f9f9",
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 2, position: "relative" }} elevation={6}>
            {isAuthor && (
              <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => {
                    if (isEditing) {
                      handleSaveAll();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    if (window.confirm("确认要退出登录吗？")) {
                      handleLogout();
                    }
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, ml: -1 }}>
              <EditableAvatar
                src={avatarUrl}
                onChange={(handleAvatarChange)}
                disabled={!isEditing}
              />

              <Box sx={{ ml: 3, flex: 1 }}>
                <EditableUsername
                  value={username}
                  onChange={setUsername}
                  editing={isEditing}
                />
              </Box>
            </Box>

            <Box mt={2} sx={{ ml: 1 }}>
              <EditableText value={bio} onChange={setBio} editing={isEditing} />
            </Box>

            {/* 未来模块位置：关注 / 粉丝 / 获赞 / 收藏 */}
            <Box
              mt={4}
              display="flex"
              justifyContent="space-around"
              textAlign="center"
              color="text.secondary"
            >
              <Box onClick={() => navigate(`/relationship/${routeUserId}/followings`)}>
                <Typography variant="h6">{followingCount}</Typography>
                <Typography variant="body2">关注</Typography>
              </Box>
              <Box onClick={() => navigate(`/relationship/${routeUserId}/followers`)}>
                <Typography variant="h6">{followersCount}</Typography>
                <Typography variant="body2">粉丝</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{userStats.total}</Typography>
                <Typography variant="body2">获赞与收藏</Typography>
              </Box>
            </Box>
          </Paper>

          {/* 提示弹窗 */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              severity={snackbar.severity as "success" | "error"}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
      {/* 用户发布的帖子列表（模拟数据） */}
      <Box mt={6} ml={2} mr={2}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          我发布的帖子
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr 1fr", sm: "1fr 1fr", md: "1fr 1fr" }}
          gap={2}
          mb={8}
        >
          {posts.map((post) => {
            const author = userProfiles[post.userId]; // 👈 确保你有传入 userProfiles

            return (
              <Card key={post._id} sx={{ p: 1.5, borderRadius: 3, display: "flex", flexDirection: "column", height: "100%" }} elevation={3}>
                {/* 内容区（图片 + 文案） */}
                <Box sx={{ flex: 1, cursor: "pointer" }} onClick={() => navigate(`/post/${post._id}`)}>
                  {/* 图片 */}
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <Box
                      sx={{
                        height: 180,
                        backgroundImage: `url(http://localhost:5000${post.imageUrls[0]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: 2,
                      }}
                    />
                  )}

                  {/* 文案 */}
                  <Typography variant="body2" mt={1} fontWeight="medium">
                    {post.content.length > 40
                      ? post.content.slice(0, 40) + "..."
                      : post.content}
                  </Typography>
                </Box>

                {/* 底部：用户信息 */}
                <Box
                  display="flex"
                  alignItems="center"
                  mt="auto"
                  pt={1}
                  pb={1}
                  borderTop="1px solid #eee"
                >
                  <Avatar
                    src={author?.avatar || "/default-avatar.png"}
                    sx={{ width: 30, height: 30, mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {author?.username || "未知用户"}
                  </Typography>
                </Box>
              </Card>

            );
          })}
        </Box>
      </Box>
    </>
  );
};
