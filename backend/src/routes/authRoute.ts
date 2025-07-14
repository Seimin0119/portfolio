import { Router } from "express";
import { RequestHandler } from "express";
import { registerUser, loginUser, updateProfile, getProfile } from "../controllers/authController";
import { requireLogin } from "../middlewares/requireLogin";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createPost, getPosts, updatePost, deletePost, getPostById, getPostsByUser } from "../controllers/postController";
import { uploadImages } from "../controllers/uploadImgController";
import { toggleLikePost, getLikesCount, getLikesByUser, getUserStats } from "../controllers/likeController";
import { toggleBookmarkPost, getBookmarkCount, getBookmarksByUser } from "../controllers/bookmarkController";
import { addComment, getCommentsCount, getCommentsByPost } from "../controllers/commentController";
import { upload } from "../middlewares/upload";
import { getFollowStatus, toggleFollow, getFollowers, getFollowing } from "../controllers/followController";

const router = Router();

// 用户注册接口
router.post("/register", registerUser as RequestHandler);

// 用户登录接口
router.post("/login", loginUser as RequestHandler);

// 个人主页信息更新接口
router.put("/profile/:userId", upload.single("avatar"), authenticateJWT as RequestHandler, requireLogin as RequestHandler, updateProfile as RequestHandler);

// 个人主页信息获取接口
router.get("/profile/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getProfile as RequestHandler);

// 用户发布帖子接口
router.post("/posts", upload.array("images", 9), authenticateJWT as RequestHandler, requireLogin as RequestHandler, createPost as RequestHandler);

// 用户查找帖子接口
router.get("/posts", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getPosts as RequestHandler);

// 用户查找特定帖子接口
router.get("/posts/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getPostById as RequestHandler);

// 用户查找特定用户帖子接口
router.get("/users/:userId/posts", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getPostsByUser as RequestHandler);

// 用户修改帖子接口
router.put("/posts/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, updatePost as RequestHandler);

// 用户删除帖子接口
router.delete("/posts/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, deletePost as RequestHandler);

// 上传照片接口
router.post("/upload", upload.array("images", 9), authenticateJWT as RequestHandler, uploadImages as RequestHandler);

// 点赞接口
router.post("/likes/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, toggleLikePost as RequestHandler);

// 获取点赞数量接口
router.get("/likesCount/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getLikesCount as RequestHandler);

// 获取某用户点赞的帖子列表
router.get("/likesByUser/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getLikesByUser as RequestHandler);

// 收藏接口
router.post("/bookmarks/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, toggleBookmarkPost as RequestHandler);

// 获取收藏数量接口
router.get("/bookmarksCount/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getBookmarkCount as RequestHandler);

// 获取某用户点赞的帖子列表接口
router.get("/bookmarksByUser/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getBookmarksByUser as RequestHandler);

// 添加评论接口
router.post("/addComment/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, addComment as RequestHandler);

// 获取评论数量接口
router.get("/commentsCount/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getCommentsCount as RequestHandler);

// 获取某帖的所有评论
router.get("/commentsByPost/:postId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getCommentsByPost as RequestHandler);

// 获取某用户所有帖子的点赞数与收藏数接口
router.get("/userStats/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getUserStats as RequestHandler);

// 获取我对某用户的关注状态（none | following | mutual）接口
router.get("/follow/status/:targetUserId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getFollowStatus as RequestHandler);

// 关注/取消关注接口
router.post("/follow/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, toggleFollow as RequestHandler);

// 获取关注列表（我关注了谁）接口
router.get("/following/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getFollowing as RequestHandler);

// 获取粉丝列表（谁关注了我）接口
router.get("/followers/:userId", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getFollowers as RequestHandler);

export default router;
