// controllers/commentController.ts
import { Request, Response } from "express";
import Comment from "../models/CommentModel";
import mongoose from "mongoose";

// 添加评论
export const addComment = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.id;

    try {
        const comment = await Comment.create({ postId, userId: new mongoose.Types.ObjectId(userId), content });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: "评论失败", error: err });
    }
};

// 获取某帖的所有评论数量
export const getCommentsCount = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const count = await Comment.countDocuments({ postId });
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ message: "获取评论数失败", error: err });
    }
};

// 获取某帖的所有评论
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .populate("userId", "username avatar");

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: "获取评论失败", error: err });
    }
};
