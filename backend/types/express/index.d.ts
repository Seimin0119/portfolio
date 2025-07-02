// types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export {}; // 一定不能漏！！！
