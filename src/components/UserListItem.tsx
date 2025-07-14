import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    username: string;
    avatar?: string;
    bio?: string;
}

export const UserListItem: React.FC<{ user: User }> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderBottom: "1px solid #eee",
                cursor: "pointer",
            }}
            onClick={() => navigate(`/profile/${user._id}`)}
        >
            <Avatar src={`http://localhost:5000${user.avatar}` || "/default-avatar.png"} sx={{ width: 48, height: 48 }} />
            <Box>
                <Typography variant="subtitle1">{user.username}</Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {user.bio ? user.bio : "这个人很懒，什么也没有写"}
                </Typography>
            </Box>
        </Box>
    );
};
