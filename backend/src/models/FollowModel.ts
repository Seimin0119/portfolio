// models/FollowModel.ts
import mongoose, { Schema } from "mongoose";

const FollowSchema = new Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 关注者
  following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 被关注者
  createdAt: { type: Date, default: Date.now },
});

// 同一个人不能关注同一个人多次
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model("Follow", FollowSchema);

export default Follow;