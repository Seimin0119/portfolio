// models/BookmarkModel.ts
import mongoose, { Schema } from "mongoose";

const BookmarkSchema = new Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

BookmarkSchema.index({ postId: 1, userId: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;