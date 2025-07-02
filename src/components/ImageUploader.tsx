// src/components/ImageUploader.tsx
import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    ImageList,
    ImageListItem,
    IconButton,
    Box,
    Dialog
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
    images: File[];
    onFilesSelected: (files: File[]) => void;
}

export const ImageUploader: React.FC<Props> = ({ images, onFilesSelected }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null); // ✅ 新增

    // 注册拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150, // 按住150毫秒后激活拖动
                tolerance: 5, // 拖动超过5像素也可以触发
            },
        })
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).slice(0, 9 - images.length);
            onFilesSelected([...images, ...newImages]);
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = active.data.current?.sortable.index;
            const newIndex = over.data.current?.sortable.index;
            onFilesSelected(arrayMove(images, oldIndex, newIndex));
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={images.map((_, i) => i.toString())} strategy={rectSortingStrategy}>
                    <ImageList cols={3} gap={8}>
                        {images.map((file, index) => (
                            <SortableImage
                                key={index}
                                id={index.toString()}
                                file={file}
                                onPreview={(url) => {
                                    setPreviewImage(url);
                                    setPreviewIndex(index);
                                }}
                            />
                        ))}

                        {images.length < 9 && (
                            <ImageListItem>
                                <IconButton
                                    component="label"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        border: "2px dashed #aaa",
                                        borderRadius: 2,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        aspectRatio: "1",
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 32, color: "#aaa" }} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </IconButton>
                            </ImageListItem>
                        )}
                    </ImageList>
                </SortableContext>
            </DndContext>
            <Dialog
                open={!!previewImage}
                onClose={() => {
                    setPreviewImage(null);
                    setPreviewIndex(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <Box sx={{ position: "relative" }}>
                    {/* 删除按钮 */}
                    <IconButton
                        onClick={() => {
                            if (previewIndex !== null) {
                                const newFiles = images.filter((_, i) => i !== previewIndex);
                                onFilesSelected(newFiles);
                            }
                            setPreviewImage(null);
                            setPreviewIndex(null);
                        }}
                        sx={{
                            position: "absolute",
                            right: 8,
                            bottom: 8,
                            backgroundColor: "rgba(255,0,0,0.7)",
                            color: "#fff",
                            zIndex: 1,
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>

                    {/* 预览图 */}
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="预览图"
                            style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }}
                        />
                    )}
                </Box>
            </Dialog>
        </Box>

    );
};

interface SortableImageProps {
    id: string;
    file: File;
    onPreview: (url: string) => void; // ✅ 函数类型
}

const SortableImage: React.FC<SortableImageProps> = ({ id, file, onPreview }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: "100%",
        height: "100%",
        borderRadius: 8,
        touchAction: "none", // ✅ 防止浏览器滑动干扰
    };

    const imageUrl = URL.createObjectURL(file); // ✅ 生成 URL

    return (
        <>
            <ImageListItem
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={style}
                onClick={() => onPreview(imageUrl)} // ✅ 调用外部函数显示预览
            >
                <img
                    src={URL.createObjectURL(file)}
                    alt="upload"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, pointerEvents: "none" }}
                />
            </ImageListItem>
        </>
    );
};
