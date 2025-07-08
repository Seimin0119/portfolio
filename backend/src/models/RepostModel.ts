// models/RepostModel.ts
import mongoose, { Schema } from "mongoose";

const RepostSchema = new Schema({
  originalPostId: { type: String, required: true }, // 原帖
  userId: { type: String, required: true },         // 转发者
  content: { type: String },                        // 可加一句话
  createdAt: { type: Date, default: Date.now }
});

const Repost = mongoose.model("Repost", RepostSchema);

export default Repost;