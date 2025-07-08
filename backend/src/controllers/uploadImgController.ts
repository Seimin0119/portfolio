import { Request, Response } from "express";

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
