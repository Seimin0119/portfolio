import { Request, Response } from "express";
import Post from "../models/postModel";

// 上传照片
export const uploadImages = async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "没有上传任何图片" });
      }

      const imageUrls = files.map((file) => `/uploads/${file.filename}`);
      res.status(200).json({ imageUrls });
    } catch (error) {
      console.error("上传图片失败", error);
      res.status(500).json({ message: "服务器错误" });
    }
};

// 新增帖子
export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, isPublic } = req.body;
        const userId = (req as any).user.id;

        if (!content || typeof content !== "string") {
            return res.status(400).json({ error: "内容不能为空" });
        }

        // 处理文件上传
        let finalImageUrls: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            finalImageUrls = req.files.map((file: Express.Multer.File) => `/uploads/${file.filename}`);
        }

        // 解析 tags（从 JSON 字符串）
        let parsedTags: string[] = [];
        try {
            parsedTags = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
        } catch {
            parsedTags = [];
        }

        const newPost = new Post({
            userId,
            content,
            imageUrls: finalImageUrls, // ✅ 改成用你处理好的数据
            isPublic,
            tags: parsedTags,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("发帖失败", error);
        res.status(500).json({ message: "服务器错误" });
    }
};


// 查找所有帖子
export const getPosts = async (req: Request, res: Response) => {
    try {
        const keyword = req.query.keyword as string | undefined;

        const query = keyword
            ? { content: { $regex: keyword, $options: "i" }, isPublic: true }
            : { isPublic: true };

        const posts = await Post.find(query).sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("获取帖子失败", error);
        res.status(500).json({ message: "服务器错误" });
    }
};

// 查找特定帖子
export const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).json({ message: "缺少帖子 ID" });
        }

        const post = await Post.findById(postId); // ✅ 从数据库中查找帖子

        if (!post) {
            return res.status(404).json({ message: "帖子不存在" });
        }

        const currentUserId = (req as any).user?.id;
        if (post.userId !== currentUserId && !post.isPublic) {
            return res.status(403).json({ message: "无权限查看此私密帖子" });
        }

        res.json(post);
    } catch (error) {
        console.error("获取该帖子失败", error);
        res.status(500).json({ message: "服务器错误" });
    }
};


// 查找特定用户的所有帖子
export const getPostsByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const currentUserId = (req as any).user?.id; // 当前登录用户的 ID（假设已通过中间件验证）

        if (!userId) {
            return res.status(400).json({ message: "缺少用户 ID" });
        }

        const query = { userId };

        // 如果当前登录用户不是该用户本人，只显示公开的帖子
        if (currentUserId !== userId) {
            (query as any).isPublic = true;
        }

        const posts = await Post.find(query).sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("获取用户帖子失败", error);
        res.status(500).json({ message: "服务器错误" });
    }
};

// 编辑帖子
export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const { content, imageUrls, isPublic, tags } = req.body;
        const userId = (req as any).user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "帖子不存在" });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ error: "无权限修改该帖子" });
        }

        post.content = content || post.content;
        post.imageUrls = imageUrls || post.imageUrls;
        post.isPublic = isPublic ?? post.isPublic;
        post.tags = tags || post.tags;
        post.updatedAt = new Date();

        await post.save();
        res.json(post);
    } catch (error) {
        console.error("更新帖子失败", error);
        res.status(500).json({ message: "服务器错误" });
    }
};

// 删除帖子
export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const userId = (req as any).user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "帖子不存在" });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ error: "无权限删除该帖子" });
        }

        await post.deleteOne();
        res.json({ message: "帖子已删除" });
    } catch (error) {
        console.error("删除帖子失败", error);
        res.status(500).json({ message: "服务器错误" });
    }
};

