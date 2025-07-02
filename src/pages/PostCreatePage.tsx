// pages/PostCreatePage.tsx
import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { PostEditor } from "../components/PostEditor";

export const PostCreatePage: React.FC = () => {
    return (
        <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
            <Toolbar />
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6">发帖</Typography>
                </Toolbar>
            </AppBar>
            <PostEditor />
        </Box>
    );
};