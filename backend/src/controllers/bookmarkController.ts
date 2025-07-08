// controllers/bookmarkController.ts
import { Request, Response } from "express";
import Bookmark from "../models/BookmarkModel";


// 收藏
export const toggleBookmarkPost = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = (req as any).user.id;

    try {
        const existing = await Bookmark.findOne({ postId, userId });

        if (existing) {
            // 已经收藏过 → 取消收藏
            await Bookmark.deleteOne({ postId, userId });
            res.status(200).json({ message: "取消收藏成功", liked: false });
        } else {
            // 没收藏过 → 收藏
            await Bookmark.create({ postId, userId });
            res.status(201).json({ message: "收藏成功", liked: true });
        }
    } catch (err) {
        res.status(500).json({ message: "收藏失败", error: err });
    }
};

// 获取收藏数量
export const getBookmarkCount = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const count = await Bookmark.countDocuments({ postId });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ message: "获取收藏数失败", error: err });
    }
};

// 获取某用户收藏的帖子列表
export const getBookmarksByUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const bookmarks = await Bookmark.find({ userId });
        res.status(200).json({ bookmarks });
    } catch (err) {
        res.status(500).json({ message: "获取收藏失败", error: err });
    }
};
