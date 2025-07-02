// src/components/ImageCarousel.tsx
import React from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface ImageCarouselProps {
    images: string[];
    aspectRatio?: string; // 默认 4:3，可以传 "16 / 9" 等
    height?: number;      // 可选：如果不想用比例，也可传固定高度
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    aspectRatio = "4 / 3",
    height,
}) => {
    if (!images || images.length === 0) return null;

    return (
        <Box
            sx={{
                width: "100%",
                ...(height
                    ? { height: `${height}px` }
                    : { aspectRatio }), // 高度和比例二选一
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Swiper
                modules={[Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                style={{ width: "100%", height: "100%" }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <Box
                            component="img"
                            src={`http://localhost:5000${img}`}
                            alt={`post-img-${idx}`}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};
