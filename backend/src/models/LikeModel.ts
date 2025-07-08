// models/LikeModel.ts
import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

LikeSchema.index({ postId: 1, userId: 1 }, { unique: true }); // 避免重复点赞

const Like = mongoose.model("Like", LikeSchema);

export default Like;