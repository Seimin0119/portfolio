import { Router } from "express";
import { RequestHandler } from "express";
import { registerUser, loginUser, updateProfile, getProfile } from "../controllers/authController";
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

export default router;
