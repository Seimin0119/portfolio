import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
const API_BASE = "http://localhost:5000";

export const Register: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usernameOrEmail: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const url = isLogin
        ? `${API_BASE}/api/auth/login`
        : `${API_BASE}/api/auth/register`;

      const bodyData = isLogin
        ? {
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        }
        : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "操作失败");
        return;
      }

      if (isLogin) {
        // 登录成功，保存userId
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("data.token111", data.token)
        // 登录成功，保存token，跳转帖子页
        localStorage.setItem("token", data.token);
        // 登录成功后：
        login(data.user);  // 👈 自动存入 context 和 localStorage，并刷新 avatar
        navigate(`/profile/${data.user.id}`);
      } else {
        // 注册成功，切换到登录页面
        setIsLogin(true);
        setError(null);
      }
    } catch (err) {
      setError("网络错误，请稍后再试");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "93vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        background:
          "linear-gradient(90deg, #5a67d8, #805ad5, #d53f8c)",
      }}
    >
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Paper elevation={6} sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {isLogin ? "登录你的账户" : "创建你的账户"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="昵称"
                margin="normal"
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            )}

            <TextField
              fullWidth
              label={isLogin ? "用户名或邮箱" : "邮箱"}
              type={isLogin ? "text" : "email"}
              margin="normal"
              required
              name={isLogin ? "usernameOrEmail" : "email"}
              value={isLogin ? formData.usernameOrEmail : formData.email}
              onChange={handleChange}
              autoFocus={!isLogin}
            />

            <TextField
              fullWidth
              label="密码"
              type="password"
              margin="normal"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
            >
              {isLogin ? "登录" : "注册"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
            onClick={() => {
              setError(null);
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "没有账号？立即注册" : "已有账号？立即登录"}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
