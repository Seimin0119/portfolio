import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box
} from "@mui/material";

export const Posts: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "第一次参加线下聚会，感受很棒！",
      excerpt:
        "大家都非常热情，结识了不少朋友，期待下一次活动。",
    },
    {
      id: 2,
      title: "求推荐好吃的横滨中华料理",
      excerpt: "最近想找一家正宗的中餐厅，有什么好地方推荐吗？",
    },
    {
      id: 3,
      title: "语言学习交流群，有兴趣的请进",
      excerpt: "想提高日语和中文交流，欢迎大家加入我们的学习群。",
    },
    {
      id: 4,
      title: "语言学习交流群，有兴趣的请进",
      excerpt: "想提高日语和中文交流，欢迎大家加入我们的学习群。",
    }
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(90deg, #5a67d8, #805ad5, #d53f8c)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        px: 2,
        textAlign: "center",
      }}
    >
      <Container maxWidth={false} sx={{ px: 2, width: "100%" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          帖子列表
        </Typography>
        <Grid container spacing={4}>
          {posts.map(({ id, title, excerpt }) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { boxShadow: 8, cursor: "pointer" },
                }}
                onClick={() => alert(`点击帖子: ${title}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {title}
                  </Typography>
                  <Typography>{excerpt}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    阅读更多 →
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
