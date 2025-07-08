// controllers/likeController.ts
import { Request, Response } from "express";
import Like from "../models/LikeModel";
import Post from "../models/postModel";
import Bookmark from "../models/BookmarkModel";

// 点赞
export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = (req as any).user.id;

    try {
        const existing = await Like.findOne({ postId, userId });

        if (existing) {
            // 已经点过赞 → 取消点赞
            await Like.deleteOne({ postId, userId });
            res.status(200).json({ message: "取消点赞成功", liked: false });
        } else {
            // 没点过赞 → 点赞
            await Like.create({ postId, userId });
            res.status(201).json({ message: "点赞成功", liked: true });
        }
    } catch (err) {
        res.status(500).json({ message: "点赞操作失败", error: err });
    }
};

// 获取点赞数量
export const getLikesCount = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const count = await Like.countDocuments({ postId });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ message: "获取点赞数失败", error: err });
    }
};

// 获取某用户点赞的帖子列表
export const getLikesByUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const likes = await Like.find({ userId });
        res.status(200).json({ likes });
    } catch (err) {
        res.status(500).json({ message: "获取点赞失败", error: err });
    }
};

// 获取某用户所有帖子的点赞数与收藏数
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        // 先获取该用户的所有帖子
        const posts = await Post.find({ userId });
        const postIds = posts.map((p) => p._id);

        // 分别统计这些帖子的点赞与收藏
        const likesCount = await Like.countDocuments({ postId: { $in: postIds } });
        const bookmarksCount = await Bookmark.countDocuments({ postId: { $in: postIds } });

        res.status(200).json({
            likes: likesCount,
            bookmarks: bookmarksCount,
            total: likesCount + bookmarksCount,
        });
    } catch (err) {
        res.status(500).json({ message: "获取统计信息失败", error: err });
    }
};