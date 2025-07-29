import { Request, Response } from "express";
import Message from "../models/MessageModel";

// 发送消息
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const sender = (req as any).user.id;
    const { receiver, content } = req.body;

    try {
        const message = await Message.create({ sender, receiver, content });
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: "发送消息失败", error: err });
    }
};

// 获取与某用户的历史消息
export const getMessages = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    const otherId = req.params.userId;

    try {
        // 查询所有相关消息
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherId },
                { sender: otherId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        // 把“对方发给你的未读消息”全部设为已读
        await Message.updateMany(
            { sender: otherId, receiver: userId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ message: "获取消息失败", error: err });
    }
};


// 获取所有与当前用户相关的消息
export const getAllMyMessages = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    try {
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        });
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ message: "获取所有消息失败", error: err });
    }
};