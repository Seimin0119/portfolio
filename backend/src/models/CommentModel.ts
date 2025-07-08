// models/CommentModel.ts
import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  postId: { type: String, required: true },     // 关联的帖子
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ 关键是这一行
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;