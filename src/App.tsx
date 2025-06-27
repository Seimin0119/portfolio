// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {Home} from "./pages/Home";
import {Register} from "./pages/Register";
import {Posts} from "./pages/Posts";

export default function App() {
  return (
    <Router>
      {/* 顶部导航栏 */}
      <nav className="bg-gray-100 p-4 flex gap-6 justify-center shadow">
        <Link to="/" className="text-blue-600 hover:underline">首页</Link>
        <Link to="/register" className="text-blue-600 hover:underline">注册</Link>
        <Link to="/posts" className="text-blue-600 hover:underline">帖子</Link>
      </nav>

      {/* 路由配置 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </Router>
  );
}
