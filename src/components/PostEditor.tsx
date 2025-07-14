// components/PostEditor.tsx
import React, { useState } from "react";
import {
    Box,
    TextField,
    Switch,
    FormControlLabel,
    Chip,
    Stack,
    Button,
    Divider,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import SendIcon from "@mui/icons-material/Send";
import { ImageUploader } from "./ImageUploader";
import { createPosts, updatePost, } from "../api/postApi";
import { uploadImages } from "../api/uploadImgApi";
import { useNavigate } from "react-router-dom";
interface PostEditorProps {
    postId?: string;
    initialContent?: string;
    initialIsPublic?: boolean;
    initialTags?: string[];
    initialImages?: string[];
}

export const PostEditor: React.FC<PostEditorProps> = ({
    postId,
    initialContent = "",
    initialIsPublic = true,
    initialTags = [],
    initialImages = []
}) => {
    const [text, setText] = useState(initialContent);
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [tagInput, setTagInput] = useState("");
    const [existingImages, setExistingImages] = useState<string[]>(initialImages); // 后端图片路径
    const [newImages, setNewImages] = useState<File[]>([]); // 新上传图片文件
    const navigate = useNavigate();

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            setTags((prev) => [...prev, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleSubmit = async () => {
        if (!text.trim()) return;

        try {
            let uploadedImageUrls: string[] = [];

            // 上传新图片
            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach((file) => formData.append("images", file));

                const res = await uploadImages(formData);

                uploadedImageUrls = res.imageUrls; // 后端返回路径数组
            }

            const finalImageUrls = [...existingImages, ...uploadedImageUrls];

            if (postId) {
                await updatePost(postId, {
                    content: text,
                    imageUrls: finalImageUrls,
                    isPublic,
                    tags,
                });
                alert("修改成功！");
            } else {
                await createPosts(text, newImages, isPublic, tags); // 创建逻辑不变
                alert("发布成功！");
            }

            navigate("/posts"); // ✅ 成功后跳转首页
        } catch (err) {
            alert("提交失败：" + (err as Error).message);
            console.error(err);
        }
    };


    return (
        <Box sx={{ flex: 1, p: 2 }}>
            <TextField
                multiline
                fullWidth
                rows={5}
                placeholder="这一刻的想法..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            {/* ✅ 显示已有图片并支持删除 */}
            <Stack direction="row" spacing={1} mt={2}>
                {existingImages.map((url, idx) => (
                    <Box key={idx} position="relative">
                        <img
                            src={`http://localhost:5000${url}`}
                            width={100}
                            height={100}
                            style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                        <Button
                            size="small"
                            onClick={() => {
                                setExistingImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                minWidth: 0,
                                padding: "2px",
                                fontSize: 10,
                            }}
                            color="error"
                        >
                            X
                        </Button>
                    </Box>
                ))}
            </Stack>

            {/* 新图片上传器 */}
            <ImageUploader images={newImages} onFilesSelected={setNewImages} />

            <FormControlLabel
                control={<Switch checked={isPublic} onChange={() => setIsPublic(!isPublic)} />}
                label={isPublic ? "公开" : "私密"}
                sx={{ mt: 3 }}
            />

            <TextField
                label="添加标签 (#)"
                variant="outlined"
                size="small"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                sx={{ mt: 2 }}
            />

            <Stack direction="row" spacing={1} mt={1}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={`#${tag}`}
                        onDelete={() => {
                            setTags(prev => prev.filter((_, i) => i !== index));
                        }}
                    />
                ))}
            </Stack>

            <Divider sx={{ my: 3 }} />
            <Button startIcon={<AddLocationIcon />} variant="text" disabled>
                添加当前位置 (开发中)
            </Button>

            <Button
                onClick={handleSubmit}
                disabled={!text.trim()}
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{ mt: 3, ml: 6 }}
            >
                {postId ? "保存修改" : "发布"}
            </Button>
        </Box>
    );
};