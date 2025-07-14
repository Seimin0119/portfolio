import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "./components/TopBar";
import { BottomNavBar } from "./components/BottomNavBar";
import { Posts } from "./pages/Posts";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { PostDetailPage } from "./pages/PostDetailPage";
import { PostCreatePage } from "./pages/PostCreatePage";
import { PostEditPage } from "./pages/PostEditPage";
import { UserProvider } from "./contexts/UserContext";
import { isAuthenticated } from "./util/auth";
import { FollowListPage } from "./pages/FollowListPage";
import { FollowFeedPage } from "./pages/FollowFeedPage";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/following" element={<FollowFeedPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<PostCreatePage />} />
          <Route path="/edit/:id" element={<PostEditPage />} />
          <Route path="/relationship/:id/:tab" element={<FollowListPage />} />
          <Route
            path="/profile/:id"
            element={
              isAuthenticated() ? <Profile /> : <Navigate to="/register" replace />
            }
          />
          <Route path="/post/:postId" element={<PostDetailPage />} />
        </Routes>
        <BottomNavBar />
      </Router>
    </UserProvider>
  );
}
