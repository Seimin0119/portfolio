import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../util/auth";

export const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  const pathMap = ["/posts", "/following", "/create", "/messages", "/profile"];

  useEffect(() => {
    const currentIndex = pathMap.indexOf(location.pathname);
    setValue(currentIndex !== -1 ? currentIndex : 0);
  }, [location.pathname]);

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
    const targetPath = pathMap[newValue];

    // 如果是点击 "我"（/profile），但未登录，跳转到 /register 登录页面
    if (targetPath === "/profile" && !isAuthenticated()) {
      navigate("/register");  // 👈 跳转到登录注册页
    } else {
      navigate(targetPath);   // 👈 正常跳转
    }
  };


  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="首页" icon={<HomeIcon />} />
        <BottomNavigationAction label="关注" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="发布" icon={<AddBoxIcon />} />
        <BottomNavigationAction label="消息" icon={<MessageIcon />} />
        <BottomNavigationAction label="我" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};
