import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { EditableAvatar } from "../components/EditableAvatar";
import { EditableText } from "../components/EditableText";
import { updateUserProfile, getUserProfile } from "../api/userApi";
import { getCurrentUser } from "../util/auth";
import { useUser } from "../contexts/UserContext";

export const Profile: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
  const [bio, setBio] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { login } = useUser();
  const user = getCurrentUser();
  const userId = user?.id;
  console.log("user,userId", user, userId)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const data = await getUserProfile(userId);
        console.log("获取用户数据:", data); // 👈 打印这句看看有没有 avatar 字段
        if (data.avatar) setAvatarUrl("http://localhost:5000" + data.avatar);
        if (data.bio) setBio(data.bio);
      } catch (err) {
        console.error("❌ 获取用户信息失败:", err);
      }
    };

    fetchProfile();
  }, []);


  const handleAvatarChange = async (file: File) => {
    try {
      // 本地预览（可保留）
      setAvatarUrl(URL.createObjectURL(file));

      // 上传到后端
      await updateUserProfile(userId, { avatar: file });
      setSnackbar({ open: true, message: "头像上传成功", severity: "success" });
      login(user);  // 👈 自动存入 context 和 localStorage，并刷新 avatar
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "头像上传失败", severity: "error" });
    }
  };


  const handleBioSave = async (newText: string) => {
    try {
      setBio(newText);

      await updateUserProfile(userId, { bio: newText });
      setSnackbar({ open: true, message: "简介更新成功", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "简介更新失败", severity: "error" });
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#f9f9f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, textAlign: "center" }} elevation={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            个人主页
          </Typography>

          <EditableAvatar src={avatarUrl} onChange={handleAvatarChange} />

          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              个人简介
            </Typography>
            <EditableText value={bio} onSave={handleBioSave} />
          </Box>
        </Paper>
      </Container>

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
    </Box>
  );
};
