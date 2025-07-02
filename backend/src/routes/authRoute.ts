import { Router } from "express";
import { RequestHandler } from "express";
import { registerUser, loginUser, updateProfile, getProfile } from "../controllers/authController";
import { requireLogin } from "../middlewares/requireLogin";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createPost, getPosts, updatePost, deletePost, getPostById, getPostsByUser, uploadImages } from "../controllers/postController";
import { upload } from "../middlewares/upload";

const router = Router();

// 用户注册接口
router.post("/register", registerUser as RequestHandler);

// 用户登录接口
router.post("/login", loginUser as RequestHandler);

// 个人主页信息更新接口
router.put("/profile/:id", upload.single("avatar"), updateProfile as RequestHandler);

// 个人主页信息获取接口
router.get("/profile/:id", getProfile as RequestHandler);

// 用户发布帖子接口
router.post("/posts", upload.array("images", 9), authenticateJWT as RequestHandler, requireLogin as RequestHandler, createPost as RequestHandler);

// 用户查找帖子接口
router.get("/posts", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getPosts as RequestHandler);

// 用户查找特定帖子接口
router.get("/posts/:id", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getPostById as RequestHandler);

// 用户查找特点用户帖子接口
router.get("/users/:id/posts", authenticateJWT as RequestHandler, requireLogin as RequestHandler, getPostsByUser as RequestHandler);

// 用户修改帖子接口
router.put("/posts/:id", authenticateJWT as RequestHandler, requireLogin as RequestHandler, updatePost as RequestHandler);

// 用户删除帖子接口
router.delete("/posts/:id", authenticateJWT as RequestHandler, requireLogin as RequestHandler, deletePost as RequestHandler);

// 上传照片接口
router.post("/upload", upload.array("images", 9), authenticateJWT as RequestHandler, uploadImages as RequestHandler, );


export default router;
