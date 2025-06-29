import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户名或邮箱是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "用户名或邮箱已存在" });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "注册成功" });
  } catch (error) {
    console.error("注册失败", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // 先找用户名或邮箱匹配的用户
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "用户不存在" });
    }

    // 密码匹配
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "密码错误" });
    }

    // 生成JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "登录成功",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("登录失败", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 修改用户资料
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { bio } = req.body;
    let avatarUrl = "";

    // 如果上传了头像文件
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    const updateData: any = {};
    if (typeof bio === "string") updateData.bio = bio;
    if (avatarUrl) updateData.avatar = avatarUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "用户未找到" });
    }

    res.json({
      message: "资料更新成功",
      user: updatedUser,
    });
  } catch (error) {
    console.error("更新失败", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("avatar bio");
    if (!user) return res.status(404).json({ message: "用户不存在" });
    res.json({
      avatar: user.avatar || "/default-avatar.png",
      bio: user.bio || "",
    });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

