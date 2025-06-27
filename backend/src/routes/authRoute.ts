import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { RequestHandler } from "express";

const router = Router();

// 用户注册接口
router.post("/register", registerUser as RequestHandler);

// 用户登录接口
router.post("/login", loginUser as RequestHandler);

export default router;
