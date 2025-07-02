import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// 自定义Request类型，断言有user属性
interface CustomRequest extends Request {
  user?: JwtPayload & { userId?: string };
}

export const authenticateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET); // 打印环境变量
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof decoded === "object" && decoded !== null) {
        // 这里断言 req.user 类型
        req.user = decoded as JwtPayload & { userId?: string };
        return next();
      } else {
        return res.status(403).json({ message: "无效的 Token 载荷" });
      }
    } catch (err) {
      console.error("JWT 验证失败:", err);
      return res.status(403).json({ message: "无效的 Token" });
    }
  } else {
    return res.status(401).json({ message: "未提供 Token" });
  }
};
