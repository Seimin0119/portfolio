import { Request, Response } from "express";
import Follow from "../models/FollowModel";

// 获取我对某用户的关注状态（none | following | mutual）
export const getFollowStatus = async (req: Request, res: Response): Promise<void> => {
    const currentUserId = (req as any).user.id;
    const targetUserId = req.params.targetUserId;

    if (!targetUserId) {
        res.status(400).json({ error: "缺少 targetUserId 参数" });
        return;
    }

    try {
        const isFollowing = await Follow.findOne({
            follower: currentUserId,
            following: targetUserId,
        });

        const isFollowedBack = await Follow.findOne({
            follower: targetUserId,
            following: currentUserId,
        });

        let status: "none" | "following" | "mutual" = "none";

        if (isFollowing && isFollowedBack) {
            status = "mutual";
        } else if (isFollowing) {
            status = "following";
        }

        res.json({ status });
    } catch (err) {
        console.error("获取关注状态失败", err);
        res.status(500).json({ error: "服务器错误" });
    }
};

// 关注/取消关注
export const toggleFollow = async (req: Request, res: Response) => {
    const followerId = (req as any).user.id;
    const followingId = req.params.userId;

    if (followerId === followingId) {
        return res.status(400).json({ message: "不能关注自己" });
    }

    try {
        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });

        if (existingFollow) {
            // 取消关注
            await Follow.deleteOne({ _id: existingFollow._id });
            return res.status(200).json({ message: "已取消关注", followed: false, status: "none" });
        } else {
            // 新增关注
            await Follow.create({ follower: followerId, following: followingId });

            // 判断是否互相关注
            const mutual = await Follow.findOne({ follower: followingId, following: followerId });
            const status = mutual ? "mutual" : "following";

            return res.status(200).json({ message: "关注成功", followed: true, status });
        }
    } catch (err) {
        res.status(500).json({ message: "关注操作失败", error: err });
    }
};

// 获取关注列表（我关注了谁）
export const getFollowing = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const followings = await Follow.find({ follower: userId }).populate("following", "username avatar bio");
        res.json(followings.map((f) => f.following));
    } catch (err) {
        res.status(500).json({ message: "获取关注列表失败", error: err });
    }
};

// 获取粉丝列表（谁关注了我）
export const getFollowers = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const followers = await Follow.find({ following: userId }).populate("follower", "username avatar bio");
        res.json(followers.map((f) => f.follower));
    } catch (err) {
        res.status(500).json({ message: "获取粉丝列表失败", error: err });
    }
};