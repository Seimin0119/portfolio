import { BottomNavigation, BottomNavigationAction, Paper, Badge } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../util/auth";
import { getCurrentUser } from "../util/auth";
import { getAllMyMessages } from "../api/messageApi";

export const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [unread, setUnread] = useState(0);
  const user = getCurrentUser();
  const userId = user?.id;
  const pathMap = ["/posts", "/following", "/create", "/messages", `/profile/${userId}`];

  useEffect(() => {
    const currentIndex = pathMap.indexOf(location.pathname);
    setValue(currentIndex !== -1 ? currentIndex : 0);
  }, [location.pathname]);

  useEffect(() => {
    // 获取未读消息数
    const fetchUnread = async () => {
      if (!userId) return;
      try {
        const res = await getAllMyMessages(); // getAllMyMessages 只传 token
        let count = 0;
        (res.messages || []).forEach((msg: any) => {
          if (msg.receiver === userId && !msg.read) count++;
        });
        setUnread(count);
      } catch (err) {
        setUnread(0);
      }
    };
    fetchUnread();
  }, [userId]);

  const handleChange = (_event: any, newValue: number) => {
    const dynamicPathMap = ["/posts", "/following", "/create", "/messages", `/profile/${userId}`];
    const targetPath = dynamicPathMap[newValue];

    setValue(newValue);

    if (targetPath.includes("/profile") && !isAuthenticated()) {
      navigate("/register");
    } else {
      navigate(targetPath);
    }
  };

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="首页" icon={<HomeIcon />} />
        <BottomNavigationAction label="关注" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="发布" icon={<AddBoxIcon />} />
        <BottomNavigationAction
          label="消息"
          icon={
            <Badge color="error" variant="dot" invisible={unread === 0}>
              <MessageIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="我" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};
