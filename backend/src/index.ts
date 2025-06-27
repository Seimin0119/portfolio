import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute";

dotenv.config();

const app = express();

// 端口读取 .env 或默认5000
const PORT = process.env.PORT || 5000;

// 数据库连接字符串，注意统一用同一个变量名（.env 中是 MONGO_URL）
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/community";

// 中间件：允许跨域，解析json请求体
app.use(cors());
app.use(express.json());

// 路由，等后续解注释挂载
app.use("/api/auth", authRoutes);

// 连接数据库
mongoose
  .connect(MONGO_URL, { 
    dbName: "japan-chinese-community", // 指定数据库名
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    // 连接成功后才启动服务器监听
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
