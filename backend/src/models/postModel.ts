// models/PostModel.ts
import mongoose, { Schema } from "mongoose";

export interface IPost {
    id: string;              // 帖子唯一ID（UUID或Mongo ObjectID等）
    userId: string;          // 发帖用户ID
    content: string;         // 帖子内容（文案）
    imageUrls?: string[];     // 图片地址（上传后返回的URL）
    isPublic: boolean;       // 是否公开
    tags?: string[];          // 标签，例如 ["#旅行", "#美食"]
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        userId: { type: String, required: true },
        content: { type: String, required: true },
        imageUrls: [String],
        isPublic: { type: Boolean, default: true },
        tags: [String],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }
);

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;