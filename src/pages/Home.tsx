import React from "react";
import { Container, Typography, Button, Stack, Box } from "@mui/material";

export const Home: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "93vh",
        background: "linear-gradient(90deg, #5a67d8, #805ad5, #d53f8c)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          欢迎来到 <span style={{ color: "#FFEB3B" }}>在日华人交友平台</span>
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: "#FFF9C4" }}>
          这里是你结识朋友、分享动态、展开精彩生活的理想场所。  
          加入我们，一起打造温暖开放的社区氛围！
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Button
            variant="contained"
            color="warning"
            size="large"
            href="/register"
          >
            立即注册
          </Button>
          <Button variant="outlined" color="inherit" size="large" href="/posts">
            浏览帖子
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
