// components/FollowButton.tsx
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toggleFollow, getFollowStatus } from "../api/followApi";


interface FollowButtonProps {
    targetUserId: string; // 被关注者
}

export const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId }) => {
    const [status, setStatus] = useState<"none" | "following" | "mutual">("none");

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await getFollowStatus(targetUserId); // 返回 "none" | "following" | "mutual"
                setStatus(res.status);
            } catch (err) {
                console.error("获取关注状态失败", err);
            }
        };
        fetchStatus();
    }, [targetUserId]);

    const handleClick = async () => {
        try {
            const res = await toggleFollow(targetUserId); // 自动切换状态
            setStatus(res.status || (res.followed ? "following" : "none"));
        } catch (err) {
            console.error("关注操作失败", err);
        }
    };

    const getLabel = () => {
        if (status === "following") return "已关注";
        if (status === "mutual") return "互相关注";
        return "关注";
    };

    return (
        <Button
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
            onClick={handleClick}
        >
            {getLabel()}
        </Button>
    );
};
