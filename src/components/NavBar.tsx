// src/components/NavBar.tsx
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const NavBar: React.FC = () => {
    const { user, avatarUrl, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* 左侧导航 */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        color="primary"
                        sx={{ textDecoration: "none" }}
                    >
                        首页
                    </Typography>
                    <Typography
                        component={Link}
                        to="/posts"
                        variant="h6"
                        color="primary"
                        sx={{ textDecoration: "none" }}
                    >
                        帖子
                    </Typography>
                </Box>

                {/* 右侧用户区 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {!user ? (
                        <Button
                            component={Link}
                            to="/register"
                            variant="outlined"
                            color="primary"
                        >
                            注册
                        </Button>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/profile"
                                title="个人主页"
                                sx={{ padding: 0, minWidth: 0 }}
                            >
                                <Avatar
                                    src={avatarUrl || "/default-avatar.png"}
                                    sx={{ width: 36, height: 36 }}
                                />
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                color="error"
                                size="small"
                            >
                                退出
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
