// pages/PostEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, AppBar, Toolbar, Typography } from "@mui/material";
import { getPostById } from "../api/postApi";
import { PostEditor } from "../components/PostEditor";

export const PostEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getPostById(id).then(setPost).catch(console.error);
        }
    }, [id]);

    if (!post) return <CircularProgress />;

    return (
        <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
            <Toolbar />
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6">编辑帖子</Typography>
                </Toolbar>
            </AppBar>

            <PostEditor
                postId={post._id}
                initialContent={post.content}
                initialTags={post.tags}
                initialIsPublic={post.isPublic}
                initialImages={post.imageUrls}
            />
        </Box>
    );
};