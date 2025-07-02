import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const requireLogin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "未登录，访问被拒绝" });
  }

  const userId = (req.user as any).id;
  if (!userId) {
    return res.status(401).json({ message: "无效的用户信息" });
  }

  next();
};
