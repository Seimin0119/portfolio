import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyFollowings, getMyFollowers } from "../api/followApi";
import { UserListItem } from "../components/UserListItem";

export const FollowListPage: React.FC = () => {
    const { tab } = useParams(); // "mutual" | "followings" | "followers"
    const { id: routeUserId } = useParams();
    const navigate = useNavigate();
    const [followings, setFollowings] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                if (!routeUserId) return; // 没有 userId 参数就不执行
                const [fs, frs] = await Promise.all([getMyFollowings(routeUserId), getMyFollowers(routeUserId)]);
                setFollowings(fs);
                setFollowers(frs);
            } catch (err) {
                console.error("获取关注数据失败", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleTabChange = (_: any, newValue: string) => {
        if (!routeUserId) return;
        navigate(`/relationship/${routeUserId}/${newValue}`);
    };

    const getDisplayList = () => {
        if (tab === "mutual") {
            return followings.filter((f) =>
                followers.some((fr) => fr._id === f._id)
            );
        }
        if (tab === "followers") return followers;
        return followings;
    };
    return (
        <Box
            sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f5f6fa",
                py: 4,
            }}
            mt={4}
        >
            <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="互相关注" value="mutual" />
                <Tab label="关注" value="followings" />
                <Tab label="粉丝" value="followers" />
            </Tabs>

            <Box sx={{ mt: 3 }}>
                {loading ? (
                    <Typography align="center">加载中...</Typography>
                ) : (
                    getDisplayList().map((user) => <UserListItem key={user._id} user={user} />)
                )}
            </Box>
        </Box>
    );
};
